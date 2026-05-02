import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import NotFound from './NotFound';
import ExcelMinoxTemplate from './templates/ExcelMinoxTemplate';
import AuraGlowTemplate from './templates/AuraGlowTemplate';
import QuantumChicTemplate from './templates/QuantumChicTemplate';
import CustomTemplateRenderer from './templates/CustomTemplateRenderer';
import { LandingPage } from '../types';

const LandingPageView: React.FC = () => {
    const { currentPageId, getPageById, getCustomTemplateById, settings } = useAppContext();
    
    let page: LandingPage | undefined | null = null;

    if (currentPageId && currentPageId.startsWith('preview_')) {
        const previewDataString = localStorage.getItem('previewPageData');
        if (previewDataString) {
            const previewData = JSON.parse(previewDataString);
            // Ensure the stored data corresponds to the current preview request
            if (previewData.id === currentPageId) {
                page = previewData;
            }
        }
    } else if (currentPageId) {
        page = getPageById(currentPageId);
    }

    useEffect(() => {
        // Facebook Pixel integration
        let pixelScript: HTMLScriptElement | null = null;
        let pixelNoScript: HTMLElement | null = null;

        if (settings.facebookPixelId) {
            pixelScript = document.createElement('script');
            pixelScript.id = 'fb-pixel-script';
            pixelScript.innerHTML = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${settings.facebookPixelId}');
                fbq('track', 'PageView');
            `;
            document.head.appendChild(pixelScript);

            pixelNoScript = document.createElement('noscript');
            pixelNoScript.id = 'fb-pixel-noscript';
            pixelNoScript.innerHTML = `<img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1"
            />`;
            document.head.appendChild(pixelNoScript);
        }

        // Cleanup function
        return () => {
            // Clean up preview data from localStorage
            if (currentPageId && currentPageId.startsWith('preview_')) {
                localStorage.removeItem('previewPageData');
            }

            // Clean up Facebook Pixel scripts
            if (pixelScript) {
                pixelScript.remove();
            }
            if (pixelNoScript) {
                pixelNoScript.remove();
            }
        };
    }, [currentPageId, settings.facebookPixelId]);

    if (!currentPageId && !page) {
        return <NotFound />;
    }
    
    if (!page) {
        return <NotFound />;
    }

    if (page.template.startsWith('ctpl_')) {
        const customTemplate = getCustomTemplateById(page.template);
        if (!customTemplate) {
            return <div className="bg-dark-bg min-h-screen flex items-center justify-center text-red-400">Custom template not found.</div>;
        }
        return <CustomTemplateRenderer page={page} template={customTemplate} />;
    }

    switch (page.template) {
        case 'excel-minox':
            return <ExcelMinoxTemplate page={page} />;
        case 'aura-glow':
            return <AuraGlowTemplate page={page} />;
        case 'quantum-chic':
            return <QuantumChicTemplate page={page} />;
        default:
            console.warn(`Unknown template: ${page.template}`);
            return <NotFound />;
    }
};

export default LandingPageView;