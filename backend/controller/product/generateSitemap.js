// backend/controller/product/generateSitemap.js
const productModel = require("../../models/productModel");

const generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://jmcomputer.com.py';
    
    // Obtener todos los productos con slug e ID (para backup) y fecha de actualización
    const products = await productModel.find({}, '_id slug updatedAt');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Añadir URLs estáticas
    const staticUrls = [
      {url: '/', priority: '1.0', changefreq: 'daily'},
      {url: '/nosotros', priority: '0.7', changefreq: 'monthly'},
      {url: '/categoria-producto?category=informatica', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=perifericos', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=cctv', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=impresoras', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=accesorios', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=software_licencias', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=telefonia', priority: '0.8', changefreq: 'weekly'},
      {url: '/categoria-producto?category=informatica&subcategory=notebooks', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=informatica&subcategory=computadoras_ensambladas', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=informatica&subcategory=placas_madre', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=informatica&subcategory=memorias_ram', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=informatica&subcategory=discos_duros', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=informatica&subcategory=procesador', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=perifericos&subcategory=monitores', priority: '0.7', changefreq: 'weekly'},
      {url: '/categoria-producto?category=perifericos&subcategory=teclados', priority: '0.7', changefreq: 'weekly'},
      {url: '/buscar', priority: '0.5', changefreq: 'weekly'}
    ];
    
    const today = new Date().toISOString().split('T')[0];
    
    staticUrls.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    // Añadir URLs de productos - Usando slug si está disponible, si no, usar _id
    let productsCount = 0;
    products.forEach(product => {
      // Determinamos qué parámetro usar para el enlace del producto (slug o _id)
      const productParam = product.slug || product._id;
      
      if (productParam) {
        const lastmod = product.updatedAt ? 
          product.updatedAt.toISOString().split('T')[0] : 
          today;
        
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/producto/${productParam}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
        productsCount++;
      }
    });
    
    xml += '</urlset>';
    
    // Agregar un log para debug
    console.log(`Sitemap generado con ${productsCount} productos`);
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generando sitemap:', error);
    res.status(500).send('Error generando sitemap');
  }
};

module.exports = generateSitemap;