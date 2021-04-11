import {RouterPermissionMappingModel} from '../data-components/router-permission-mapping.model';

export const USER_PERMISSION_CODE = {
  EMPLOYEE_MANAGEMENT: 'EMPLOYEE_MANAGEMENT',
  ZONING_TYPE_MANAGEMENT: 'ZONING_TYPE_MANAGEMENT',
  ZONING_INFORMATION_MANAGEMENT: 'ZONING_INFORMATION_MANAGEMENT',
  CUSTOMER_MANAGEMENT: 'CUSTOMER_MANAGEMENT',
  CONSTRUCTION_VIOLATE_MANAGEMENT: 'CONSTRUCTION_VIOLATE_MANAGEMENT',
  CONSTRUCTION_VIOLATE_REQUEST: 'CONSTRUCTION_VIOLATE_REQUEST',
  ZONING_SEARCH: 'ZONING_SEARCH',
  PRODUCT_MANAGEMENT: 'PRODUCT_MANAGEMENT'
};

export const ROUTER_USER_PERMISSION_MAPPER = [
  new RouterPermissionMappingModel(
    {
      routerLink: '/',
      matchUrl: '',
      name: 'Trang chủ',
      icon: 'fa-home',
      permissions: [],
      sort: 0,
      isMenu: false
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/trang-chu',
      matchUrl: '',
      name: 'Trang chủ',
      icon: 'fa-home',
      permissions: [],
      sort: 1,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/thay-doi-mat-khau',
      matchUrl: '',
      name: '',
      icon: '',
      permissions: [],
      sort: 0,
      isMenu: false
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-chuc-vu',
      matchUrl: '',
      name: 'Quản lý chức vụ',
      icon: 'fa-users-cog',
      permissions: [
        USER_PERMISSION_CODE.EMPLOYEE_MANAGEMENT
      ],
      sort: 2,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-can-bo',
      matchUrl: '',
      name: 'Quản lý cán bộ',
      icon: 'fa-users',
      permissions: [
        USER_PERMISSION_CODE.EMPLOYEE_MANAGEMENT
      ],
      sort: 3,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-quy-hoach',
      matchUrl: '\/quan-ly-quy-hoach(\/[a-z-]{1,})?',
      name: 'Quản lý quy hoạch',
      icon: 'fa-building',
      permissions: [
        USER_PERMISSION_CODE.ZONING_TYPE_MANAGEMENT
      ],
      sort: 4,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-thong-tin-dat',
      matchUrl: '',
      name: 'Quản lý thông tin đất',
      icon: 'fa-landmark',
      permissions: [
        USER_PERMISSION_CODE.ZONING_INFORMATION_MANAGEMENT
      ],
      sort: 5,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-nhom-khach-hang',
      matchUrl: '',
      name: 'Quản lý nhóm khách hàng',
      icon: 'fa-users',
      permissions: [
        USER_PERMISSION_CODE.CUSTOMER_MANAGEMENT
      ],
      sort: 6,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/tra-cuu-thong-tin',
      matchUrl: '',
      name: 'Tra cứu thông tin',
      icon: 'fa-landmark',
      permissions: [],
      sort: 7,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-vi-pham-xay-dung',
      matchUrl: '',
      name: 'Lĩnh vực xây dựng',
      icon: 'fa-copy',
      permissions: [
        USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_MANAGEMENT,
        USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_REQUEST
      ],
      sort: 6,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/tao-bien-ban-xu-phat-xay-dung',
      matchUrl: '',
      name: '',
      icon: '',
      permissions: [
        USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_MANAGEMENT,
        USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_REQUEST
      ],
      sort: 0,
      isMenu: false
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '',
      matchUrl: '\/xu-ly-vi-pham-xay-dung\/\\d+',
      name: '',
      icon: '',
      permissions: [
        USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_MANAGEMENT,
        USER_PERMISSION_CODE.CONSTRUCTION_VIOLATE_REQUEST
      ],
      sort: 0,
      isMenu: false
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/quan-ly-khach-hang',
      matchUrl: '',
      name: 'Quản lý khách hàng',
      icon: 'fa-user-friends',
      permissions: [
        USER_PERMISSION_CODE.CUSTOMER_MANAGEMENT
      ],
      sort: 7,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/color',
      matchUrl: '',
      name: 'Màu sắc',
      icon: 'fas fa-paint-brush',
      permissions: [
        USER_PERMISSION_CODE.PRODUCT_MANAGEMENT
      ],
      sort: 0,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/size',
      matchUrl: '',
      name: 'Kích thước',
      icon: 'fas fa-object-group',
      permissions: [
        USER_PERMISSION_CODE.PRODUCT_MANAGEMENT
      ],
      sort: 1,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/category',
      matchUrl: '',
      name: 'Danh mục hàng hoá',
      icon: 'fas fa-boxes',
      permissions: [
        USER_PERMISSION_CODE.PRODUCT_MANAGEMENT
      ],
      sort: 2,
      isMenu: true
    }),
  new RouterPermissionMappingModel(
    {
      routerLink: '/sub-category',
      matchUrl: '',
      name: 'Danh mục con hàng hoá',
      icon: 'fas fa-boxes',
      permissions: [
        USER_PERMISSION_CODE.PRODUCT_MANAGEMENT
      ],
      sort: 3,
      isMenu: true
    }),
];
