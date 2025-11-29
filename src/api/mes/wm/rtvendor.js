import request from '@/utils/request'

// 查询供应商退货单列表
export function listRtVendor(query) {
  return request({
    url: '/mes/wm/rtvendor/list',
    method: 'get',
    params: query
  })
}

// 查询供应商退货单详细
export function getRtVendor(rtId) {
  return request({
    url: '/mes/wm/rtvendor/' + rtId,
    method: 'get'
  })
}

// 新增供应商退货单
export function addRtVendor(data) {
  return request({
    url: '/mes/wm/rtvendor',
    method: 'post',
    data: data
  })
}

// 修改供应商退货单
export function updateRtVendor(data) {
  return request({
    url: '/mes/wm/rtvendor',
    method: 'put',
    data: data
  })
}

// 删除供应商退货单
export function delRtVendor(rtId) {
  return request({
    url: '/mes/wm/rtvendor/' + rtId,
    method: 'delete'
  })
}

// 执行供应商退货
export function executeRtVendor(rtId) {
  return request({
    url: '/mes/wm/rtvendor/execute/' + rtId,
    method: 'put'
  })
}

// 导出供应商退货单
export function exportRtVendor(query) {
  return request({
    url: '/mes/wm/rtvendor/export',
    method: 'post',
    params: query
  })
}
