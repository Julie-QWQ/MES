import request from '@/utils/request'

// 查询产品入库单列表
export function listProductRecpt(query) {
  return request({
    url: '/mes/wm/productrecpt/list',
    method: 'get',
    params: query
  })
}

// 查询产品入库单详细
export function getProductRecpt(recptId) {
  return request({
    url: '/mes/wm/productrecpt/' + recptId,
    method: 'get'
  })
}

// 新增产品入库单
export function addProductRecpt(data) {
  return request({
    url: '/mes/wm/productrecpt',
    method: 'post',
    data: data
  })
}

// 修改产品入库单
export function updateProductRecpt(data) {
  return request({
    url: '/mes/wm/productrecpt',
    method: 'put',
    data: data
  })
}

// 删除产品入库单
export function delProductRecpt(recptId) {
  return request({
    url: '/mes/wm/productrecpt/' + recptId,
    method: 'delete'
  })
}

// 执行产品入库
export function executeProductRecpt(recptId) {
  return request({
    url: '/mes/wm/productrecpt/execute/' + recptId,
    method: 'put'
  })
}

// 导出产品入库单
export function exportProductRecpt(query) {
  return request({
    url: '/mes/wm/productrecpt/export',
    method: 'post',
    params: query
  })
}
