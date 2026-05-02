import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { LandingPage, CustomTemplate, Order, Product, TemplateComponent } from '../../types';
import NotFound from '../NotFound';
import CustomTemplateOrderForm from '../../components/CustomTemplateOrderForm';

interface CustomTemplateRendererProps {
    page: LandingPage;
    template: CustomTemplate;
}

const CustomTemplateRenderer: React.FC<CustomTemplateRendererProps> = ({ page, template }) => {
    const { products: allProducts } = useAppContext();
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

    const pageProducts = useMemo(() => {
        return page.productIds.map(id => allProducts.find(p => p.id === id)).filter((p): p is Product => !!p);
    }, [page.productIds, allProducts]);
    
    const handleOrderSuccess = (order: Order) => {
        setPlacedOrder(order);
        setOrderSuccess(true);
        window.scrollTo(0, 0);
    };

    if (orderSuccess) {
        const trackingUrl = `https://track-your-order.com/tracking?courier=${encodeURIComponent(placedOrder?.courier || '')}&id=${placedOrder?.trackingId}`;
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#333', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
                <h1>Thank You!</h1>
                <p>Your order has been placed successfully.</p>
                <p>We will contact you shortly to confirm.</p>
                {placedOrder?.trackingId && (
                     <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            marginTop: '2rem',
                            display: 'inline-block',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd',
                            color: '#333',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Track Your Order
                    </a>
                )}
            </div>
        );
    }
    
    if (pageProducts.length === 0) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">This page has no products assigned.</div>;
    }

    const renderComponent = (component: TemplateComponent) => {
        const { type, props, id } = component;
        const mainProduct = pageProducts[0];
        
        // Create a deep copy to avoid modifying the original template structure
        const processedProps = JSON.parse(JSON.stringify(props));

        if (mainProduct) {
            for (const key in processedProps) {
                const propValue = processedProps[key as keyof typeof processedProps];
                if (typeof propValue === 'string') {
                    (processedProps as any)[key] = propValue
                        .replace(/{{product.name}}/g, mainProduct.name)
                        .replace(/{{product.price}}/g, String(mainProduct.price.toFixed(2)))
                        .replace(/{{product.description}}/g, mainProduct.description)
                        .replace(/{{product.imageUrl}}/g, mainProduct.imageUrl);
                }
            }
        }

        const styles = processedProps.styles || {};

        switch (type) {
            case 'Heading':
                const Tag = `h${processedProps.level || 1}` as React.ElementType;
                return <Tag key={id} style={styles}>{processedProps.text}</Tag>;
            case 'Text':
                return <p key={id} style={styles}>{processedProps.text}</p>;
            case 'Image':
                return <img key={id} src={processedProps.src} alt={processedProps.alt} style={styles} />;
            case 'Button':
                return <a key={id} href={processedProps.link || '#'} style={styles}>{processedProps.text || 'Button'}</a>;
            case 'Hero': {
                const heroStyles: React.CSSProperties = {
                    ...styles,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${processedProps.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px'
                };
                return (
                    <div key={id} style={heroStyles}>
                        <h1 style={{fontSize: '3rem', fontWeight: 'bold', margin: 0}}>{processedProps.title}</h1>
                        <p style={{fontSize: '1.25rem', marginTop: '1rem', maxWidth: '600px'}}>{processedProps.subtitle}</p>
                        {processedProps.buttonText && (
                            <a href={processedProps.buttonLink || '#'} style={{
                                display: 'inline-block',
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '1rem 2rem',
                                textDecoration: 'none',
                                borderRadius: '5px',
                                marginTop: '2rem',
                                fontWeight: 'bold'
                            }}>
                                {processedProps.buttonText}
                            </a>
                        )}
                    </div>
                );
            }
            case 'OrderForm':
                return <div id="order-form" key={id}><CustomTemplateOrderForm products={pageProducts} page={page} onOrderSuccess={handleOrderSuccess} /></div>;
            default:
                return null;
        }
    };

    return (
        <div className="custom-template-wrapper bg-white">
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-4">
                {template.structure.map(renderComponent)}
            </div>
        </div>
    );
};

export default CustomTemplateRenderer;