# MantaGO Website Assets

This directory contains all the visual assets for the MantaGO website. Below are the required images and their specifications:

## Required Images

### Logo Files
- `eslitec-logo.svg` - Main Eslitec logo (colored version)
- `eslitec-logo-white.svg` - White version for dark backgrounds

### Portrait Images
- `sebastien-khoo.jpg` - Professional portrait of Sebastien Khoo for hero section (300x300px minimum)
- `sebastien-profile.jpg` - Alternative profile photo for about section (300x300px minimum)

### Product Screenshots
- `mantago-dashboard.jpg` - Screenshot of MantaGO dashboard (1200x600px minimum)

### Client Testimonials
- `client-1.jpg` - Sarah Chen profile photo (60x60px)
- `client-2.jpg` - Marcus Rodriguez profile photo (60x60px)  
- `client-3.jpg` - Emily Watson profile photo (60x60px)

### Case Studies
- `case-study-1.jpg` - Manufacturing transformation image (400x200px)
- `case-study-2.jpg` - Logistics revolution image (400x200px)
- `case-study-3.jpg` - Startup success image (400x200px)

### Partner Logos
- `partner-1.svg` - Microsoft logo
- `partner-2.svg` - Google Cloud logo
- `partner-3.svg` - AWS logo
- `partner-4.svg` - Salesforce logo
- `partner-5.svg` - SAP logo
- `partner-6.svg` - Oracle logo

## Image Guidelines

### Technical Specifications
- **Format**: JPG for photos, SVG for logos and icons
- **Resolution**: Minimum 2x for retina displays
- **Optimization**: Compress images for web (80-90% quality for JPG)
- **Responsive**: Provide multiple sizes if needed

### Design Guidelines
- **Professional**: All images should maintain a professional, corporate aesthetic
- **Consistent**: Use consistent lighting and color treatment
- **Brand Colors**: Incorporate brand colors (corporate blue #2563eb, tech green #10b981) where appropriate
- **Background**: Clean, minimal backgrounds that don't distract from content

### Content Guidelines
- **Portraits**: Professional business attire, neutral expressions, good lighting
- **Screenshots**: Clean UI, real data, demonstrate key features
- **Case Studies**: Industry-relevant imagery, modern business environments
- **Logos**: Official brand assets with proper usage rights

## Placeholder Assets

Until real assets are available, you can use:
- **Portraits**: Professional stock photos from Unsplash or similar
- **Screenshots**: Mockup tools like Figma, Sketch, or design software
- **Logos**: Official brand assets downloaded from company websites
- **Case Studies**: Industry-specific stock photography

## Implementation Notes

1. Add `loading="lazy"` to images below the fold for performance
2. Use CSS `object-fit: cover` for consistent aspect ratios
3. Implement responsive images with `srcset` for different screen sizes
4. Add proper `alt` text for accessibility
5. Consider using WebP format with JPG fallback for better compression

## File Naming Convention

- Use lowercase letters and hyphens
- Be descriptive: `sebastien-khoo-profile.jpg`
- Include size indicators: `logo-small.svg`, `hero-image-large.jpg`
- Version numbers if needed: `dashboard-v2.jpg`