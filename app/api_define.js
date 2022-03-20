const apiDefine = [
  {
    service: 'app',
    headers: {},
    url: "/app/v1",
    fn: [
      { name: 'listModule', method: 'GET', prefix: '/modules' },
    ]
  },
  {
    service: 'public',
    headers: {},
    url: "/public",
    fn: [
      { name: 'login', method: 'POST', prefix: '/authenticate' },
      { name: 'getAppVersion', method: 'GET', prefix: '/v1/app/version' },
    ]
  },
  {
    service: 'admin',
    headers: {},
    url: "/admin/v1",
    fn: [
      { name: 'getAuthUser', method: 'GET', prefix: '/user' }, //authUser
      { name: 'changePassword', method: 'POST', prefix: '/change-password' }, //authUser
    ],
    children: [

      {
        service: 'keKho',
        url: "/kekho",
        fn: [
          { name: 'list', method: 'GET', prefix: '/all' },
          { name: 'listAllChiNhanhKho', method: 'GET', prefix: '/chi-nhanh-kho/:chiNhanhKhoId' },
          { name: 'search', method: 'GET', prefix: '/search' },
          // { name: 'get', method: 'GET', prefix: '/active/:id' },
          { name: 'create', method: 'POST', prefix: '' },
          { name: 'import', method: 'POST', prefix: '' },
          { name: 'update', method: 'PUT', prefix: '/:id' },
          { name: 'delete', method: 'DELETE', prefix: '/:id' },
        ]
      },
      // Phieu Dat Vat Tu Cuon
      {
        service: 'phieuDatVatTuCuon',
        url: "/phieu-dat-vat-tu-cuon",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'getList', method: 'GET', prefix: '/active' },
          { name: 'search', method: 'GET', prefix: '/search' },
          { name: 'getByMaNCC', method: 'GET', prefix: '/ncc/:maNCC' },
          { name: 'getByMaNccTrangThai', method: 'GET', prefix: '/get-by-ncc' },
        ]
      },
      {
        service: 'phieuDatVatTuKhac',
        url: "/phieu-dat-vat-tu-khac",
        fn: [
          { name: 'getList', method: 'GET', prefix: '' },
          { name: 'create', method: 'POST', prefix: '' },
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'delete', method: 'DELETE', prefix: '/:id' },
          { name: 'getByMaNccTrangThai', method: 'GET', prefix: '/get-by-ncc' },
          // { name: 'search', method: 'GET', prefix: '/search' },
          // { name: 'getByMaNCC', method: 'GET', prefix: '/ncc/:maNCC' },
        ]
      },
      // Phieu Nhap Vat Tu Cuon
      {
        service: 'phieuNhapVatTuCuon',
        url: "/phieu-nhap-vat-tu-cuon",
        fn: [
          { name: 'create', method: 'POST', prefix: '/' },
          { name: 'import', method: 'POST', prefix: '/' }, //import master data
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'getList', method: 'GET', prefix: '/active' },
          { name: 'filter', method: 'GET', prefix: '/filter' },
        ]
      },
      {
        service: 'phieuNhapVatTuKhac',
        url: "/phieu-nhap-vat-tu-khac",
        fn: [
          { name: 'create', method: 'POST', prefix: '/' },
          { name: 'import', method: 'POST', prefix: '/' }, //import master data
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'getList', method: 'GET', prefix: '/active' },
          { name: 'filter', method: 'GET', prefix: '/filter' },
        ]
      },
      {
        service: 'vatTuKho', // vattu cuon & vattu khac & vattu To`
        url: "/",
        fn: [
          { name: 'filterVatTuKhacKho', method: 'GET', prefix: 'vat-tu-khac-kho/filter' },
          { name: 'filterVatTuCuonKho', method: 'GET', prefix: 'vat-tu-cuon-kho/filter' },
        ]
      },
      {
        service: 'vatTuKhac',
        url: "/vattukhac",
        fn: [
          { name: 'import', method: 'POST', prefix: '' },
          { name: 'listVatTuKhacByIdCap2', method: 'GET', prefix: '/find-by-vat-tu-2/:idVatTuCap2' },

          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'listVatTuKhac', method: 'GET', prefix: '/' },
        ]
      },
    ]
  },
  {
    service: 'v1',
    headers: {},
    url: "/v1",
    children: [

      {
        service: 'boPhan',
        url: "/bophan",
        fn: [
          { name: 'import', method: 'POST', prefix: '' },
        ]
      },

      {
        service: 'provider',
        url: "/provider",
        fn: [
          { name: 'import', method: 'POST', prefix: '' },
          { name: 'create', method: 'POST', prefix: '' },
          { name: 'address', method: 'POST', prefix: '/address' },
          { name: 'contact', method: 'POST', prefix: '/contact' },
          { name: 'bank', method: 'POST', prefix: '/bank' },
          { name: 'list', method: 'GET', prefix: '/active' },
        ]
      },

      {
        service: 'cdn',
        url: "/cdn",
        fn: [
          { name: 'upload', method: 'POST', prefix: '/upload' },
        ]
      },

      {
        service: 'mayMoc',
        url: "/maymoc",
        fn: [
          { name: 'import', method: 'POST', prefix: '' },
          { name: 'listMayMoc', method: 'GET', prefix: '' },
        ]
      },
      {
        service: 'nganhNghe',
        url: "/nganhnghe",
        fn: [
          { name: 'import', method: 'POST', prefix: '' },
        ]
      },
      {
        service: 'lenhSanXuat',
        url: "/lenhsx",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'donDatHang', method: 'POST', prefix: '/dondathang' },
        ]
      },
      {
        service: 'donDatHang',
        url: "/dondathang",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'getAllDDH', method: 'GET', prefix: '/all' },
          { name: 'listDDH', method: 'GET', prefix: '' },
          { name: 'baoGia', method: 'GET', prefix: '/baogia' },
        ]
      },


      //VAT TU
      //VAT TU
      //VAT TU
      {
        service: 'vatTuCap1',
        url: "/vattu1",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'listVatTuCap1', method: 'GET', prefix: '/' },
          { name: 'import', method: 'POST', prefix: '/' },
        ]
      },
      {
        service: 'vatTuCap2',
        url: "/vattu2",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'listVatTuCap2', method: 'GET', prefix: '/' },
          { name: 'listVatTuCap2ByCode', method: 'GET', prefix: '/vattucap1/:codeVatTuCap1' },
          { name: 'import', method: 'POST', prefix: '/' },
        ]
      },
      {
        service: 'vatTuCuon',
        url: "/vattucuon",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'listVatTuCuon', method: 'GET', prefix: '/' },
          { name: 'listVatTuCuonByIdCap2', method: 'GET', prefix: '/find-by-vat-tu-2/:idVatTuCap2' },
          { name: 'import', method: 'POST', prefix: '' },
        ]
      },


      //KHO
      //KHO
      //KHO
      {
        service: 'khoVatTu',
        url: "/kho/vattu",
        fn: [
          { name: 'listKhoVatTuCuon', method: 'GET', prefix: '/:idVatTuCuon' },
        ]
      },
      {
        service: 'khoBanIn',
        url: "/kho/banin",
        fn: [
          { name: 'listBanIn', method: 'GET', prefix: '/' },
        ]
      },
      {
        service: 'khoBanKhuon',
        url: "/kho/bankhuon",
        fn: [
          { name: 'listBanKhuon', method: 'GET', prefix: '/' },
        ]
      },
      //San pham
      {
        service: 'sanPham',
        url: "/sanpham",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
          { name: 'import', method: 'POST', prefix: '/master-data' },
        ]
      },
      {
        service: 'priceList',
        url: "/pricelist",
        fn: [
          { name: 'create', method: 'POST', prefix: '' },
          { name: 'import', method: 'POST', prefix: '/master-data/price-list' },
          { name: 'importDetail', method: 'POST', prefix: '/master-data/price-list-detail' },
        ]
      },
      {
        service: 'mayMoc',
        url: "/maymoc",
        fn: [
          { name: 'getById', method: 'GET', prefix: '/:id' },
        ]
      },
    ]
  },

];

export default apiDefine;