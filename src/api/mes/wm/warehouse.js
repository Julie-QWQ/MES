import request from '@/utils/request'

// 查询仓库设置列表


export function getTreeList(){
  return request({
    url: '/mes/wm/warehouse/getTreeList',
    method: 'get'
  })
}

// 查询仓库设置详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/mes/wm/warehouse/' + warehouseId,
    method: 'get'
  })
}

// 新增仓库设置


// 修改仓库设置


// 删除仓库设置


//更改仓库的冻结状态
export function changeFrozenState(warehouseId, status) {
  const data = {
    'warehouseId': warehouseId,
    'frozenFlag': status
  }
  return request({
    url: '/mes/wm/warehouse',
    method: 'put',
    data: data
  })
}
