import { Router } from 'express'
import { Producto } from '../../models/productos.js'

export const productosRouter = Router()

productosRouter.get('/productos', async (req, res) => {
    if (!req.session['user']) {
        return res.redirect('/')
    }
    console.log(req.query)
    let opciones = {}
    const filtro = (!req.query.filtro) ? '' : { category: req.query.filtro }
    const itemsPorPagina = (!req.query.itemsPorPagina) ? opciones = { limit: 10, ...opciones } : opciones = { limit: req.query.itemsPorPagina, ...opciones }
    const pagina = (!req.query.pagina) ? opciones = { page: 1, ...opciones } : opciones = { page: req.query.pagina, ...opciones }
    const orden = (!req.query.order) ? '' : opciones = { sort: { 'price': req.query.order }, ...opciones }
    opciones = { lean: true, ...opciones }
    const paginado = await Producto.paginate(filtro, opciones)
    const pagesNavBar = []
    for (let i = 1; i <= paginado.totalPages; i++) {
        const page = i
        const status = (i === paginado.page) ? 'active' : ''
        pagesNavBar.push({ page, status })
    }

    const results = {
        status: 'success',
        payload: paginado.docs,
        totalPages: paginado.totalPages,
        prevPage: paginado.prevPage,
        nextPage: paginado.nextPage,
        page: paginado.page,
        hasPrevPage: paginado.hasPrevPage,
        hasNextPage: paginado.hasNextPage,
        prevLink: `/?pagina=${paginado.prevPage}`,
        nextLink: `/?pagina=${paginado.nextPage}`,
        navBar: pagesNavBar
    }
    const isAdmin = (req.session['user'].level === 'admin') ? true : false
    res.render('productos', {
        titulo: 'Lista de Productos',
        results: results,
        user: req.session['user'],
        isAdmin
    })
})

productosRouter.get('/init', async (req, res) => {
    const dataSet = [
        {title:"Atún en Aceite",description:"Filetes de atún en aceite de oliva, rico en omega-3. Lata de 200g.",code:"PQR678",price:5.99,status:true,stock:200,category:"Conservas",image:"atun_aceite_oliva.jpg"},
        {title:"Yogur Griego",description:"Yogur griego natural sin azúcares añadidos, cremoso y delicioso. Envase de 500g.",code:"STU901",price:4.29,status:true,stock:90,category:"Lácteos",image:"yogur_griego.jpg"},
        {title:"Aceite de Coco",description:"Aceite de coco virgen prensado en frío, ideal para cocinar y cuidado de la piel. Botella de 250ml.",code:"VWX234",price:6.99,status:true,stock:150,category:"Aceites y Vinagres",image:"aceite_coco.jpg"},
        {title:"Queso Parmesano",description:"Queso parmesano añejo de calidad premium, perfecto para rallar sobre tus platos favoritos. Bloque de 250g.",code:"YZA567",price:3.79,status:true,stock:110,category:"Quesos",image:"queso_parmesano.jpg"},
        {title:"Café Orgánico",description:"Café orgánico de comercio justo, tostado medio. Paquete de 500g.",code:"BCD890",price:7.49,status:true,stock:180,category:"Café",image:"cafe_organico.jpg"},
        {title:"Tomates Cherry",description:"Tomates cherry frescos, ideales para ensaladas y aperitivos. Envase de 250g.",code:"EFG123",price:2.19,status:true,stock:60,category:"Frutas y Verduras",image:"tomates_cherry.jpg"},
        {title:"Miel de Abeja Pura",description:"Miel de abeja 100% natural, sin aditivos. Tarro de 500g.",code:"HIJ456",price:9.99,status:true,stock:250,category:"Endulzantes",image:"miel_abeja.jpg"},
        {title:"Galletas de Avena",description:"Galletas integrales de avena y miel, saludables y deliciosas. Paquete de 300g.",code:"KLM789",price:4.99,status:true,stock:130,category:"Snacks",image:"galletas_integrales.jpg"},
        {title:"Aceitunas Negras",description:"Aceitunas negras Kalamata de origen griego, con un sabor único. Envase de 150g.",code:"NOP012",price:1.49,status:true,stock:70,category:"Aceitunas y Encurtidos",image:"aceitunas_kalamata.jpg"},
        {title:"Sopa Instantánea de Lentejas",description:"Sopa instantánea de lentejas, lista para disfrutar en minutos. Bolsa de 400g.",code:"QRS345",price:5.49,status:true,stock:95,category:"Conservas",image:"sopa_lentejas.jpg"},
        {title:"Salsa de Tomate",description:"Pasta de tomate orgánica, sin conservantes ni colorantes. Frasco de 350g.",code:"TUV456",price:3.99,status:true,stock:120,category:"Salsas",image:"pasta_tomate_organica.jpg"},
        {title:"Quinoa Blanca",description:"Quinoa blanca de origen peruano, fuente de proteínas y fibra. Bolsa de 1kg.",code:"WXY789",price:6.79,status:true,stock:80,category:"Granos",image:"quinoa_blanca.jpg"},
        {title:"Yogur de Almendra",description:"Yogur de almendra vegano y sin lactosa, alternativa saludable. Envase de 400g.",code:"ZAB012",price:4.49,status:true,stock:100,category:"Lácteos Alternativos",image:"yogur_almendra.jpg"},
        {title:"Pan Integral",description:"Pan integral multigrano, rico en semillas y cereales. Paquete de 500g.",code:"CDE345",price:2.89,status:true,stock:150,category:"Panadería",image:"pan_integral_multigrano.jpg"},
        {title:"Huevos Orgánicos",description:"Huevos orgánicos de gallinas felices, ricos en proteínas y nutrientes. Docena.",code:"FGH678",price:5.29,status:true,stock:90,category:"Huevos y Lácteos",image:"huevos_organicos.jpg"},
        {title:"Cereal de Avena",description:"Cereal de avena con trozos de frutas secas, opción saludable para el desayuno. Caja de 350g.",code:"IJK901",price:3.19,status:true,stock:110,category:"Desayuno",image:"cereal_avena_frutas.jpg"},
        {title:"Mantequilla de Almendra",description:"Mantequilla de almendra natural, sin azúcares añadidos. Tarro de 250g.",code:"LMN234",price:8.49,status:true,stock:70,category:"Frutos Secos",image:"mantequilla_almendra.jpg"},
        {title:"Salmón Ahumado",description:"Salmón ahumado de calidad premium, ideal para aperitivos y platos gourmet. Envase de 150g.",code:"OPQ567",price:11.99,status:true,stock:130,category:"Pescados y Mariscos",image:"salmon_ahumado.jpg"},
        {title:"Té Verde",description:"Té verde matcha de origen japonés, antioxidante y revitalizante. Lata de 50g.",code:"RST890",price:9.29,status:true,stock:160,category:"Tés e Infusiones",image:"te_verde_matcha.jpg"},
        {title:"Galletas de Chocolate",description:"Galletas crujientes con trozos de chocolate y nueces. Paquete de 200g.",code:"UVW123",price:4.99,status:true,stock:120,category:"Snacks",image:"galletas_chocolate_nueces.jpg"},
        {title:"Aceite de Oliva",description:"Aceite de oliva extra virgen, prensado en frío. Botella de 500ml.",code:"XYZ987",price:10.99,status:true,stock:75,category:"Aceites y Vinagres",image:"aceite_oliva_extra.jpg"},
        {title:"Mango Fresco",description:"Mango fresco y jugoso, ideal para postres y ensaladas. Unidad.",code:"MNO345",price:1.79,status:true,stock:40,category:"Frutas y Verduras",image:"mango_fresco.jpg"},
        {title:"Leche de Almendra",description:"Leche de almendra sin azúcares añadidos, alternativa vegetal. Envase de 1 litro.",code:"ABC123",price:3.99,status:true,stock:90,category:"Lácteos Alternativos",image:"leche_almendra.jpg"},
        {title:"Pimiento Rojo",description:"Pimiento rojo fresco, perfecto para ensaladas y platos asados. Unidad.",code:"PQR678",price:2.49,status:true,stock:60,category:"Frutas y Verduras",image:"pimiento_rojo.jpg"},
        {title:"Vino Tinto",description:"Vino tinto reserva, añejado en barricas de roble. Botella de 750ml.",code:"DEF456",price:15.99,status:true,stock:25,category:"Bebidas Alcohólicas",image:"vino_tinto_reserva.jpg"},
        {title:"Pasta Integral",description:"Pasta integral de trigo, fuente de fibra. Paquete de 500g.",code:"GHI789",price:2.29,status:true,stock:80,category:"Pasta",image:"pasta_integral_trigo.jpg"},
        {title:"Miel",description:"Miel de manuka con propiedades medicinales, grado premium. Tarro de 250g.",code:"JKL012",price:19.99,status:true,stock:30,category:"Endulzantes",image:"miel_manuka.jpg"},
        {title:"Tofu",description:"Tofu orgánico, fuente de proteínas vegetales. Bloque de 300g.",code:"MNP345",price:4.79,status:true,stock:50,category:"Vegetariano",image:"tofu_organico.jpg"},
        {title:"Agua Mineral",description:"Agua mineral natural embotellada. Botella de 1 litro.",code:"QRS678",price:0.99,status:true,stock:100,category:"Bebidas",image:"agua_mineral.jpg"},
        {title:"Almendras",description:"Almendras tostadas y saladas, perfectas como snack. Bolsa de 250g.",code:"TUV901",price:6.49,status:true,stock:70,category:"Frutos Secos",image:"almendras_tostadas.jpg"}
    ]
    await Producto.deleteMany()
    await Producto.insertMany(dataSet)
    res.send('Base de datos creada')

})