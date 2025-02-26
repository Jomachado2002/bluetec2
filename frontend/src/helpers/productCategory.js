const productCategory = [
  {
      id: 1,
      label: "Informática",
      value: "informatica",
      subcategories: [
          { id: 101, label: "Notebooks", value: "notebooks" },
          { id: 102, label: "Computadoras Ensambladas", value: "computadoras_ensambladas" },
          { id: 103, label: "Placas Madre", value: "placas_madre" },
          { id: 104, label: "Memorias RAM", value: "memorias_ram" },
          { id: 105, label: "Discos Duros", value: "discos_duros" },
          { id: 105, label: "Procesador", value: "procesador" },
      ]
  },
  {
      id: 2,
      label: "Periféricos",
      value: "perifericos",
      subcategories: [
          { id: 201, label: "Monitores", value: "monitores" },
          { id: 202, label: "Teclados", value: "teclados" },
          { id: 203, label: "Mouses", value: "mouses" },
          { id: 204, label: "Adaptadores", value: "adaptadores" },
          { id: 503, label: "Airpods", value: "airpods" }
      ]
  },
  {
      id: 3,
      label: "CCTV",
      value: "cctv",
      subcategories: [
          { id: 301, label: "Cámaras de Seguridad", value: "camaras_seguridad" },
          { id: 302, label: "Grabadores DVR", value: "dvr" },
          { id: 303, label: "NAS", value: "nas" }
      ]
  },
  {
      id: 4,
      label: "Impresoras",
      value: "impresoras",
      subcategories: [
          { id: 401, label: "Impresoras Láser", value: "impresoras_laser" },
          { id: 402, label: "Impresoras Multifunción", value: "impresoras_multifuncion" }
      ]
  },
  {
      id: 5,
      label: "Accesorios",
      value: "accesorios",
      subcategories: [
          { id: 501, label: "Fuentes de Alimentación", value: "fuentes_alimentacion" },
          { id: 502, label: "UPS", value: "ups" },
          
      ]
  },
  {
      id: 6,
      label: "Software y Licencias",
      value: "software_licencias",
      subcategories: [
          { id: 601, label: "Licencias de Software", value: "licencias" }
      ]
  },
  {
      id: 7,
      label: "Telefonía",
      value: "telefonia",
      subcategories: [
          { id: 701, label: "Teléfonos Móviles", value: "telefonos_moviles" },
          { id: 702, label: "Teléfonos Fijos", value: "telefonos_fijos" }
      ]
  }
];

export default productCategory;
