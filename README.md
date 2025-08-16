# MantaGO Website

A modern, responsive one-page website showcasing MantaGO products and Eslitec Pte. Ltd.'s capabilities under the leadership of Regional Director Khoo Yong Ming.

## Company Information
- **Company Name**: ESLITEC PTE. LTD.
- **UEN**: 202536043D
- **Incorporation Date**: 15 August 2025
- **Type**: Exempt Private Company Limited by Shares
- **Primary Activity**: Development of Software and Applications (SSIC 62011)
- **Registered Address**: 33 Ubi Avenue 3, #08-13, Vertex, Singapore 408868
- **Regional Director**: Khoo Yong Ming

## 🚀 Features

- **Modern Design**: Clean, professional, tech-forward aesthetic
- **Responsive Layout**: Perfect adaptation across desktop, tablet, and mobile
- **Interactive Elements**: Smooth animations, hover effects, and scroll-triggered animations
- **Dark/Light Theme**: Built-in theme toggle with persistent user preference
- **Performance Optimized**: Lazy loading, throttled scroll events, and optimized animations
- **Accessibility Focused**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Ready**: Semantic HTML5 structure with proper meta tags

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (Corporate brand color)
- **Tech Green**: #10b981 (Technology accent)
- **Grayscale**: #111827 to #f9fafb (Modern neutral palette)
- **Semantic Colors**: Success (#10b981), Warning (#f59e0b), Error (#ef4444)

### Typography
- **Headings**: Space Grotesk (Modern, technical feel)
- **Body Text**: Inter (Excellent readability)
- **Scale**: Mobile-first responsive type scale (12px to 60px)

### Component Architecture
- Reusable design tokens via CSS custom properties
- Consistent spacing system (4px/8px grid)
- Standardized border radius and shadow system
- Flexible button and form components

## 📱 Sections Overview

1. **Hero Section**
   - Compelling headline with value proposition
   - Professional portrait of Sebastien Khoo
   - Dual CTA buttons with smooth scroll navigation
   - Animated background with tech particles
   - Key performance statistics

2. **About Us**
   - Eslitec company introduction
   - Sebastien Khoo MBA background showcase
   - Core company values with icon cards
   - Vision statement with animated metrics

3. **MantaGO Product**
   - Product feature cards with hover effects
   - Interactive demo section
   - Technical advantages grid
   - Comprehensive feature highlights

4. **Solutions**
   - Target audience segmentation
   - Problem/solution matrix visualization
   - ROI benefits with animated charts
   - Industry-specific use cases

5. **Service Process**
   - Four-phase timeline with progress indicator
   - Detailed phase descriptions
   - Interactive step activation on scroll
   - Implementation metrics and guarantees

6. **Client Testimonials**
   - Rotating testimonial slider
   - Case study previews with results
   - Partner logo grid
   - Social proof elements

7. **Contact Section**
   - Comprehensive contact form with validation
   - Contact information display
   - Quick action buttons
   - Map integration placeholder

## 🛠️ Technical Implementation

### HTML Structure
- Semantic HTML5 elements
- Proper heading hierarchy (h1-h6)
- ARIA labels for accessibility
- Meta tags for SEO optimization

### CSS Architecture
- CSS Custom Properties (CSS Variables) for theming
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- Smooth animations with performance optimization
- Dark theme support

### JavaScript Features
- Intersection Observer API for scroll animations
- Throttled and debounced event handlers
- Form validation with real-time feedback
- Theme persistence with localStorage
- Smooth scrolling with polyfill support

## 🔧 Installation & Setup

1. **Clone or Download**
   ```bash
   # If using Git
   git clone [repository-url]
   cd seb-website
   ```

2. **Add Assets**
   - Place required images in the `/assets` directory
   - Refer to `assets/placeholder-info.md` for specifications

3. **Local Development**
   - Open `index.html` in a modern web browser
   - For best results, serve via local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with serve package)
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

4. **Production Deployment**
   - Upload files to web server
   - Ensure proper MIME types for SVG files
   - Enable GZIP compression for better performance

## 📁 File Structure

```
seb-website/
├── index.html              # Main HTML file
├── styles.css              # Complete CSS styles
├── script.js               # Interactive JavaScript
├── README.md               # Documentation
└── assets/                 # Images and media
    ├── placeholder-info.md # Asset requirements
    ├── sebastien-khoo.jpg  # Professional portrait
    ├── mantago-dashboard.jpg # Product screenshot
    ├── client-*.jpg        # Testimonial photos
    ├── case-study-*.jpg    # Case study images
    ├── partner-*.svg       # Partner logos
    └── eslitec-logo*.svg   # Company logos
```

## 🎯 Customization Guide

### Brand Colors
Update CSS custom properties in `:root`:
```css
:root {
  --primary-blue: #2563eb;
  --tech-green: #10b981;
  /* Add your brand colors */
}
```

### Content Updates
- **Text Content**: Edit directly in `index.html`
- **Images**: Replace files in `/assets` directory
- **Contact Info**: Update contact section details
- **Social Links**: Modify footer and contact social links

### Styling Modifications
- **Layout**: Adjust CSS Grid and Flexbox properties
- **Typography**: Change font families in CSS variables
- **Animations**: Modify transition durations and easing
- **Spacing**: Update spacing scale in CSS custom properties

## 📊 Performance Optimization

### Implemented Optimizations
- **Lazy Loading**: Images load only when visible
- **Throttled Events**: Scroll and resize events optimized
- **CSS Animations**: Hardware-accelerated transforms
- **Reduced Motion**: Respects user accessibility preferences
- **Efficient Selectors**: Optimized CSS for fast rendering

### Recommended Enhancements
- **Image Optimization**: Compress images for web delivery
- **WebP Format**: Use modern image formats with fallbacks
- **CDN Integration**: Serve assets from content delivery network
- **Critical CSS**: Inline above-the-fold styles
- **Service Worker**: Cache resources for offline access

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Indicators**: Clear focus states for all interactive elements
- **Reduced Motion**: Respects user motion preferences
- **Semantic HTML**: Proper heading structure and landmarks

## 🌐 Browser Support

### Supported Browsers
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### Progressive Enhancement
- **CSS Grid**: Graceful fallback to Flexbox
- **CSS Custom Properties**: Fallback values provided
- **Intersection Observer**: Polyfill available
- **Smooth Scrolling**: JavaScript fallback included

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Touch-Friendly**: Appropriate touch target sizes (44px minimum)
- **Fast Loading**: Optimized for mobile network speeds
- **Thumb-Reach**: Important actions within thumb reach zones

### Mobile-Specific Features
- **Hamburger Menu**: Collapsible navigation for small screens
- **Touch Gestures**: Swipe support for testimonial slider
- **Viewport Optimization**: Proper viewport meta tag
- **App-Like Feel**: Smooth animations and transitions

## 🚀 Deployment Options

### Static Hosting
- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Advanced features with continuous deployment
- **Vercel**: Optimized for performance and speed
- **AWS S3**: Scalable cloud storage solution

### Traditional Hosting
- **Shared Hosting**: Upload via FTP/SFTP
- **VPS/Dedicated**: Full control over server environment
- **CDN Integration**: Distribute globally for better performance

## 🔍 SEO Optimization

### On-Page SEO
- **Meta Tags**: Comprehensive meta descriptions and keywords
- **Structured Data**: Schema.org markup for better search visibility
- **XML Sitemap**: Generate sitemap for search engine indexing
- **Robot.txt**: Control search engine crawling

### Performance SEO
- **Page Speed**: Optimized loading times
- **Core Web Vitals**: Excellent LCP, FID, and CLS scores
- **Mobile-Friendly**: Google Mobile-Friendly Test compliant

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow existing conventions
2. **Comments**: Document complex functionality
3. **Testing**: Test across different browsers and devices
4. **Performance**: Consider impact on loading times
5. **Accessibility**: Maintain WCAG compliance

### Submitting Changes
1. Test thoroughly on multiple devices
2. Validate HTML and CSS
3. Optimize new images
4. Update documentation if needed

## 📞 Support

For technical support or customization requests:
- **Email**: [Insert contact email]
- **Documentation**: Refer to inline code comments
- **Issues**: [Insert issue tracking system]

## 📄 License

[Insert appropriate license information]

---

**Built with ❤️ by Eslitec Pte. Ltd.**  
*Transform Your Business Operations with MantaGO*

---

## Related Links
- **MantaGO Website**: https://mantago.cc
- **MantaGO Blog**: https://blog.mantago.cc
- **GitHub**: https://github.com/Eslitec-Org