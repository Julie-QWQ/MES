import request from '@/utils/request'

// 查询销售退货单列表
export function listRtSalse(query) {
  return request({
    url: '/mes/wm/rtsalse/list',
    method: 'get',
    params: query
  })
}

// 查询销售退货单详细
export function getRtSalse(rtId) {
  return request({
    url: '/mes/wm/rtsalse/' + rtId,
    method: 'get'
  })
}

// 新增销售退货单
export function addRtSalse(data) {
  return request({
    url: '/mes/wm/rtsalse',
    method: 'post',
    data: data
  })
}

// 修改销售退货单
export function updateRtSalse(data) {
  return request({
    url: '/mes/wm/rtsalse',
    method: 'put',
    data: data
  })
}

// 删除销售退货单
export function delRtSalse(rtId) {
  return request({
    url: '/mes/wm/rtsalse/' + rtId,
    method: 'delete'
  })
}

// 执行销售退货
export function executeRtSalse(rtId) {
  return request({
    url: '/mes/wm/rtsalse/execute/' + rtId,
    method: 'put'
  })
}

// 导出销售退货单
export function exportRtSalse(query) {
  return request({
    url: '/mes/wm/rtsalse/export',
    method: 'post',
    params: query
  })
}
