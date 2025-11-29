import request from '@/utils/request'

// 查询生产退料单列表
export function listRtIssue(query) {
  return request({
    url: '/mes/wm/rtissue/list',
    method: 'get',
    params: query
  })
}

// 查询生产退料单详细
export function getRtIssue(rtId) {
  return request({
    url: '/mes/wm/rtissue/' + rtId,
    method: 'get'
  })
}

// 新增生产退料单
export function addRtIssue(data) {
  return request({
    url: '/mes/wm/rtissue',
    method: 'post',
    data: data
  })
}

// 修改生产退料单
export function updateRtIssue(data) {
  return request({
    url: '/mes/wm/rtissue',
    method: 'put',
    data: data
  })
}

// 删除生产退料单
export function delRtIssue(rtId) {
  return request({
    url: '/mes/wm/rtissue/' + rtId,
    method: 'delete'
  })
}

// 执行生产退料
export function executeRtIssue(rtId) {
  return request({
    url: '/mes/wm/rtissue/execute/' + rtId,
    method: 'put'
  })
}

// 导出生产退料单
export function exportRtIssue(query) {
  return request({
    url: '/mes/wm/rtissue/export',
    method: 'post',
    params: query
  })
}
