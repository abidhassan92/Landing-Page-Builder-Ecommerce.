import React, { useState, useEffect, useCallback } from 'react';
import type { CustomTemplate, TemplateComponent } from '../types';
import { TrashIcon } from './Icon';

interface TemplateBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<CustomTemplate, 'id'> | CustomTemplate) => void;
  templateToEdit?: CustomTemplate | null;
}

const componentTypes = [
    { type: 'Hero', name: 'Hero Section' },
    { type: 'Heading', name: 'Heading' },
    { type: 'Text', name: 'Text Block' },
    { type: 'Image', name: 'Image' },
    { type: 'Button', name: 'Button' },
    { type: 'OrderForm', name: 'Order Form' },
] as const;

type ComponentType = typeof componentTypes[number]['type'];

const defaultStructure: TemplateComponent[] = [
    {
        id: `hero_${Date.now()}`,
        type: 'Hero',
        props: {
            title: '{{product.name}}',
            subtitle: '{{product.description}}',
            buttonText: 'Order Yours Today!',
            buttonLink: '#order-form',
            backgroundImageUrl: '{{product.imageUrl}}',
            styles: {
                padding: '120px 40px',
                textAlign: 'center',
                color: '#ffffff',
            }
        }
    },
    { id: `of_${Date.now()+1}`, type: 'OrderForm', props: {} },
];

const createNewComponent = (type: ComponentType): TemplateComponent => {
    const id = `${type.toLowerCase()}_${Date.now()}`;
    switch (type) {
        case 'Heading': return { id, type, props: { text: 'New Heading', level: 2, styles: { color: '#333333' } } };
        case 'Text': return { id, type, props: { text: 'New text block. Click to edit.', styles: { color: '#555555' } } };
        case 'Image': return { id, type, props: { src: 'https://picsum.photos/400/200', alt: 'placeholder', styles: { width: '100%' } } };
        case 'Button': return { id, type, props: { text: 'Click Here', link: '#', styles: { backgroundColor: '#007bff', color: '#ffffff', padding: '10px 20px', textDecoration: 'none', display: 'inline-block', borderRadius: '5px' } } };
        case 'Hero': return { id, type, props: { title: 'Hero Title', subtitle: 'A compelling subtitle.', buttonText: 'Call to Action', buttonLink: '#', backgroundImageUrl: 'https://picsum.photos/1200/600', styles: { padding: '100px 20px', textAlign: 'center', color: '#ffffff' } } };
        case 'OrderForm': return { id, type, props: {} };
    }
}

const TemplateBuilderModal: React.FC<TemplateBuilderModalProps> = ({ isOpen, onClose, onSave, templateToEdit }) => {
  const [name, setName] = useState('');
  const [structure, setStructure] = useState<TemplateComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (templateToEdit) {
      setName(templateToEdit.name);
      setStructure(templateToEdit.structure);
      setSelectedId(null);
    } else {
      setName('');
      setStructure(defaultStructure);
      setSelectedId(null);
    }
  }, [templateToEdit, isOpen]);

  const updateComponentProps = useCallback((id: string, newProps: Partial<TemplateComponent['props']>) => {
    setStructure(prev => prev.map(c => c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c));
  }, []);
  
  const updateComponentStyles = useCallback((id: string, newStyles: React.CSSProperties) => {
    setStructure(prev => prev.map(c => c.id === id ? { ...c, props: { ...c.props, styles: { ...c.props.styles, ...newStyles } } } : c));
  }, []);
  
  const deleteComponent = useCallback((id: string) => {
    setStructure(prev => prev.filter(c => c.id !== id));
    setSelectedId(null);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const templateData = { name, structure };
    if (templateToEdit) {
        onSave({ ...templateToEdit, ...templateData });
    } else {
        onSave(templateData);
    }
    onClose();
  };

  const handleDragStart = (e: React.DragEvent, type: 'new' | 'move', payload: string) => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('payload', payload);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    const type = e.dataTransfer.getData('type') as 'new' | 'move';
    const payload = e.dataTransfer.getData('payload');
    const dropIndex = dragOverIndex ?? structure.length;

    if (type === 'new') {
        const newComponent = createNewComponent(payload as ComponentType);
        const newStructure = [...structure];
        newStructure.splice(dropIndex, 0, newComponent);
        setStructure(newStructure);
    } else if (type === 'move') {
        const draggedComponent = structure.find(c => c.id === payload);
        if (!draggedComponent) return;
        const restComponents = structure.filter(c => c.id !== payload);
        const oldIndex = structure.findIndex(c => c.id === payload);
        const adjustedDropIndex = dropIndex > oldIndex ? dropIndex - 1 : dropIndex;
        
        restComponents.splice(adjustedDropIndex, 0, draggedComponent);
        setStructure(restComponents);
    }
  }

  if (!isOpen) return null;

  const selectedComponent = structure.find(c => c.id === selectedId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-dark-card rounded-lg shadow-2xl p-6 w-full max-w-7xl h-[90vh] flex flex-col border border-dark-border" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-primary">{templateToEdit ? 'Edit Template' : 'Create New Template'}</h2>
            <div className="flex items-center space-x-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border text-white hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors">Save Template</button>
            </div>
          </div>
          <div className="mb-4 flex-shrink-0">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full max-w-md bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
          </div>

          <div className="flex-grow grid grid-cols-12 gap-6 min-h-0">
            {/* Left: Components */}
            <div className="col-span-2 bg-dark-bg border border-dark-border rounded-lg p-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-300 mb-4">Components</h3>
                <div className="space-y-2">
                    {componentTypes.map(comp => (
                        <div key={comp.type} draggable onDragStart={(e) => handleDragStart(e, 'new', comp.type)} className="p-3 bg-dark-card border border-dark-border rounded-md cursor-grab text-sm text-center hover:border-primary hover:text-primary transition-colors">
                            {comp.name}
                        </div>
                    ))}
                </div>
            </div>
            {/* Middle: Canvas */}
            <div className="col-span-7 bg-white rounded-lg p-4 overflow-y-auto" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                 <div className="max-w-3xl mx-auto">
                    {structure.length === 0 && <div className="text-center text-gray-400 p-10 border-2 border-dashed rounded-lg">Drag components here to start building</div>}
                    {structure.map((component, index) => (
                        <div key={component.id} 
                             className="relative group" 
                             onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverIndex(index); }}
                             onDragLeave={() => setDragOverIndex(null)}
                        >
                            {dragOverIndex === index && <div className="h-1 bg-primary my-2"></div>}
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'move', component.id)}
                                onClick={() => setSelectedId(component.id)}
                                className={`p-2 border-2 rounded-md transition-colors ${selectedId === component.id ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                            >
                                <RenderedComponent component={component} />
                            </div>
                            <div className="absolute top-0 right-0 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => deleteComponent(component.id)} className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                     {dragOverIndex === structure.length && <div className="h-1 bg-primary my-2"></div>}
                </div>
            </div>

            {/* Right: Properties */}
            <div className="col-span-3 bg-dark-bg border border-dark-border rounded-lg p-4 overflow-y-auto">
                 <h3 className="font-semibold text-gray-300 mb-4">Properties</h3>
                 {selectedComponent ? (
                    <PropertiesPanel component={selectedComponent} onPropsChange={updateComponentProps} onStylesChange={updateComponentStyles} />
                 ) : (
                    <div className="text-center text-sm text-gray-500 pt-10">Select a component to edit its properties.</div>
                 )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const RenderedComponent: React.FC<{component: TemplateComponent}> = ({ component }) => {
    const { type, props } = component;
    const styles = props.styles || {};
    switch (type) {
        case 'Heading':
            // FIX: Use React.ElementType to correctly type the dynamic tag for JSX.
            const Tag = `h${props.level || 1}` as React.ElementType;
            return <Tag style={styles}>{props.text || 'Heading'}</Tag>;
        case 'Text':
            return <p style={styles}>{props.text || 'Text block'}</p>;
        case 'Image':
            return <img src={props.src} alt={props.alt} style={styles} />;
        case 'Button':
            return <a href={props.link || '#'} style={styles}>{props.text || 'Button'}</a>;
        case 'Hero': {
            const heroStyles: React.CSSProperties = {
                ...styles,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${props.backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
            };
            return (
                <div style={heroStyles}>
                    <h1 style={{fontSize: '2.5em', margin: 0, fontWeight: 'bold'}}>{props.title}</h1>
                    <p style={{fontSize: '1.2em', margin: '10px 0'}}>{props.subtitle}</p>
                    {props.buttonText && <span style={{display: 'inline-block', background: '#007bff', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', marginTop: '20px'}}>{props.buttonText}</span>}
                </div>
            );
        }
        case 'OrderForm':
            return <div className="p-4 text-center bg-gray-100 border-2 border-dashed rounded-lg text-gray-500">Order Form Placeholder</div>;
        default: return null;
    }
}

const PropertiesPanel: React.FC<{ component: TemplateComponent, onPropsChange: (id: string, props: any) => void, onStylesChange: (id: string, styles: any) => void }> = ({ component, onPropsChange, onStylesChange }) => {
    const handlePropChange = (key: string, value: any) => {
        onPropsChange(component.id, { [key]: value });
    }
    const handleStyleChange = (key: string, value: any) => {
        onStylesChange(component.id, { [key]: value });
    }
    
    return (
        <div className="space-y-4 text-sm">
            {component.type === 'Hero' && (
                <>
                    <div><label className="block font-medium text-gray-400 mb-1">Title</label><input type="text" value={component.props.title} onChange={(e) => handlePropChange('title', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/></div>
                    <div><label className="block font-medium text-gray-400 mb-1">Subtitle</label><textarea value={component.props.subtitle} onChange={(e) => handlePropChange('subtitle', e.target.value)} rows={3} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/></div>
                    <div><label className="block font-medium text-gray-400 mb-1">Button Text</label><input type="text" value={component.props.buttonText} onChange={(e) => handlePropChange('buttonText', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/></div>
                    <div><label className="block font-medium text-gray-400 mb-1">Button Link URL</label><input type="text" value={component.props.buttonLink} onChange={(e) => handlePropChange('buttonLink', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/></div>
                    <div><label className="block font-medium text-gray-400 mb-1">Background Image URL</label><input type="text" value={component.props.backgroundImageUrl} onChange={(e) => handlePropChange('backgroundImageUrl', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/></div>
                </>
            )}
            {('text' in component.props) && component.type !== 'Hero' && (
                <div>
                    <label className="block font-medium text-gray-400 mb-1">Text</label>
                    <textarea value={component.props.text} onChange={(e) => handlePropChange('text', e.target.value)} rows={3} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/>
                </div>
            )}
            {('link' in component.props) && (
                <div>
                    <label className="block font-medium text-gray-400 mb-1">Link URL</label>
                    <input type="text" value={component.props.link} onChange={(e) => handlePropChange('link', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/>
                </div>
            )}
             {('level' in component.props) && (
                <div>
                    <label className="block font-medium text-gray-400 mb-1">Level</label>
                    <select value={component.props.level} onChange={(e) => handlePropChange('level', Number(e.target.value))} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white">
                        <option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option>
                    </select>
                </div>
            )}
            {('src' in component.props) && (
                <div>
                    <label className="block font-medium text-gray-400 mb-1">Image URL</label>
                    <input type="text" value={component.props.src} onChange={(e) => handlePropChange('src', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/>
                </div>
            )}
             {('alt' in component.props) && (
                <div>
                    <label className="block font-medium text-gray-400 mb-1">Alt Text</label>
                    <input type="text" value={component.props.alt} onChange={(e) => handlePropChange('alt', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/>
                </div>
            )}

            <div className="pt-4 border-t border-dark-border">
                <h4 className="font-semibold text-gray-300 mb-2">Styling</h4>
                 {(component.type === 'Heading' || component.type === 'Text' || component.type === 'Hero') && (
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-400">Color</label>
                        <input type="color" value={component.props.styles?.color || '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} className="bg-transparent"/>
                    </div>
                )}
                {component.type === 'Button' && (
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-400">Background</label>
                        <input type="color" value={component.props.styles?.backgroundColor || '#007bff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="bg-transparent"/>
                    </div>
                )}
                {(component.type === 'Heading' || component.type === 'Text') && (
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-400">Font Size (px)</label>
                        <input type="number" value={parseInt(String(component.props.styles?.fontSize) || '16')} onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)} className="w-20 bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"/>
                    </div>
                )}
                {(component.type === 'Heading' || component.type === 'Text' || component.type === 'Hero') && (
                    <div className="mb-2">
                        <label className="block font-medium text-gray-400 mb-1">Text Align</label>
                        <select value={component.props.styles?.textAlign || 'left'} onChange={(e) => handleStyleChange('textAlign', e.target.value)} className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white">
                            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                        </select>
                    </div>
                 )}
                <div className="mb-2">
                    <label className="block font-medium text-gray-400 mb-1">Padding</label>
                    <input
                        type="text"
                        value={component.props.styles?.padding || ''}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        placeholder="e.g., 10px or 1em 2em"
                        className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block font-medium text-gray-400 mb-1">Margin</label>
                    <input
                        type="text"
                        value={component.props.styles?.margin || ''}
                        onChange={(e) => handleStyleChange('margin', e.target.value)}
                        placeholder="e.g., 10px auto"
                        className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block font-medium text-gray-400 mb-1">Border</label>
                    <input
                        type="text"
                        value={component.props.styles?.border || ''}
                        onChange={(e) => handleStyleChange('border', e.target.value)}
                        placeholder="e.g., 1px solid #30363D"
                        className="w-full bg-dark-card border border-dark-border rounded-md px-2 py-1 text-white"
                    />
                </div>
            </div>
        </div>
    )
}

export default TemplateBuilderModal;