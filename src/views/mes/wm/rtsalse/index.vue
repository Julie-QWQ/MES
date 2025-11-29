<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="退货单编号" prop="rtCode">
        <el-input
          v-model="queryParams.rtCode"
          placeholder="请输入退货单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="客户名称" prop="clientName">
        <el-input
          v-model="queryParams.clientName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="退货日期" prop="rtDate">
        <el-date-picker clearable
          v-model="queryParams.rtDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择退货日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="单据状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择单据状态" clearable>
          <el-option
            v-for="dict in dict.type.mes_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:wm:rtsalse:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mes:wm:rtsalse:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mes:wm:rtsalse:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mes:wm:rtsalse:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rtsalseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="退货单编号" align="center" prop="rtCode" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:wm:rtsalse:query']"
          >{{scope.row.rtCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="退货单名称" align="center" prop="rtName" />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" />
      <el-table-column label="仓库" align="center" prop="warehouseName" />
      <el-table-column label="退货日期" align="center" prop="rtDate" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rtDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            v-if="scope.row.status =='PREPARE'"
            @click="handleExecute(scope.row)"
            v-hasPermi="['mes:wm:rtsalse:execute']"
          >执行退货</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.status =='PREPARE'"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:wm:rtsalse:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status =='PREPARE'"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:wm:rtsalse:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产品销售退货单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="退货单编号" prop="rtCode">
              <el-input v-model="form.rtCode" placeholder="请输入退货单编号" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item  label-width="80">
              <el-switch v-model="autoGenFlag"
                  active-color="#13ce66"
                  active-text="自动生成"
                  @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status =='PREPARE'">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货单名称" prop="rtName">
              <el-input v-model="form.rtName" placeholder="请输入退货单名称" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="退货日期" prop="rtDate">
              <el-date-picker clearable
                v-model="form.rtDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择退货日期"
                :disabled="optType == 'view' || form.status !='PREPARE'">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户" prop="clientName">
              <el-input v-model="form.clientName" placeholder="请选择客户" :disabled="optType == 'view' || form.status !='PREPARE'">
                <el-button slot="append" icon="el-icon-search" @click="handleClientSelect" v-if="optType != 'view' && form.status =='PREPARE'"></el-button>
              </el-input>
            </el-form-item>
            <ClientSelect ref="clientSelect" @onSelected="onClientSelected"></ClientSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled placeholder="请选择单据状态">
                <el-option
                  v-for="dict in dict.type.mes_order_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="销售订单号" prop="soCode">
              <el-input v-model="form.soCode" placeholder="请输入销售订单号" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退货仓库" prop="warehouseId">
              <el-cascader v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                @change="handleWarehouseChanged"
                :disabled="optType == 'view' || form.status !='PREPARE'"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="form.rtId !=null" content-position="center">产品明细</el-divider>
        <el-card shadow="always" v-if="form.rtId !=null" class="box-card">
          <RtsalseLine ref="line" :rtId="form.rtId" :warehouseId="form.warehouseId" :locationId="form.locationId" :areaId="form.areaId" :optType="optType"></RtsalseLine>
        </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType =='view' || form.status !='PREPARE' ">返回</el-button>
        <el-button type="primary" @click="submitForm" v-if="form.status =='PREPARE' && optType !='view' ">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRtSalse, getRtSalse, delRtSalse, addRtSalse, updateRtSalse, executeRtSalse } from "@/api/mes/wm/rtsalse";
import { getTreeList } from "@/api/mes/wm/warehouse";
import { genCode } from "@/api/system/autocode/rule";
import ClientSelect from "@/components/clientSelect/single.vue";
import RtsalseLine from "./line.vue";

export default {
  name: "Rtsalse",
  dicts: ['mes_order_status'],
  components: { ClientSelect, RtsalseLine },
  data() {
    return {
      // 自动生成编码
      autoGenFlag: false,
      optType: undefined,
      warehouseInfo: [],
      warehouseOptions: [],
      warehouseProps: {
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 产品销售退货单表格数据
      rtsalseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rtCode: null,
        rtName: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        rtDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        rtCode: [
          { required: true, message: "退货单编号不能为空", trigger: "blur" }
        ],
        rtName: [
          { required: true, message: "退货单名称不能为空", trigger: "blur" }
        ],
        clientId: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        rtDate: [
          { required: true, message: "请选择退货日期", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询产品销售退货单列表 */
    getList() {
      this.loading = true;
      listRtSalse(this.queryParams).then(response => {
        this.rtsalseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询仓库树结构 */
    getWarehouseList() {
      getTreeList().then(response => {
        this.warehouseOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        rtId: null,
        rtCode: null,
        rtName: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        clientNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        rtDate: new Date(),
        status: "PREPARE",
        soCode: null,
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.autoGenFlag = false;
      this.warehouseInfo = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.rtId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品销售退货单";
      this.optType = "add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rtId = row.rtId || this.ids;
      getRtSalse(rtId).then(response => {
        this.form = response.data;
        if (this.form.warehouseId != null) {
          this.warehouseInfo[0] = this.form.warehouseId;
        }
        if (this.form.locationId != null) {
          this.warehouseInfo[1] = this.form.locationId;
        }
        if (this.form.areaId != null) {
          this.warehouseInfo[2] = this.form.areaId;
        }
        this.open = true;
        this.title = "修改产品销售退货单";
        this.optType = "edit";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rtId != null) {
            updateRtSalse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRtSalse(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const rtIds = row.rtId || this.ids;
      this.$modal.confirm('是否确认删除产品销售退货单编号为"' + rtIds + '"的数据项？').then(function() {
        return delRtSalse(rtIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/mes/wm/rtsalse/export', {
        ...this.queryParams
      }, `rtsalse_${new Date().getTime()}.xlsx`);
    },
    /** 查询明细按钮操作 */
    handleView(row) {
      this.reset();
      const rtId = row.rtId;
      getRtSalse(rtId).then(response => {
        this.form = response.data;
        if (this.form.warehouseId != null) {
          this.warehouseInfo[0] = this.form.warehouseId;
        }
        if (this.form.locationId != null) {
          this.warehouseInfo[1] = this.form.locationId;
        }
        if (this.form.areaId != null) {
          this.warehouseInfo[2] = this.form.areaId;
        }
        this.open = true;
        this.title = "查看产品销售退货单信息";
        this.optType = "view";
      });
    },
    /** 执行退货 */
    handleExecute(row) {
      const rtId = row.rtId || this.ids;
      this.$modal.confirm('确认执行退货？').then(function() {
        return executeRtSalse(rtId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("退货成功");
      }).catch(() => {});
    },
    /** 选择客户 */
    handleClientSelect() {
      this.$refs.clientSelect.showFlag = true;
    },
    onClientSelected(row) {
      if (row != undefined && row != null) {
        this.form.clientId = row.clientId;
        this.form.clientCode = row.clientCode;
        this.form.clientName = row.clientName;
        this.form.clientNick = row.clientNick;
      }
    },
    /** 仓库选择改变 */
    handleWarehouseChanged(value) {
      if (value != null && value.length > 0) {
        this.form.warehouseId = value[0];
        this.form.locationId = value[1];
        this.form.areaId = value[2];
      }
    },
    /** 自动生成编码 */
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode('RT_SALSE_CODE').then(response => {
          this.form.rtCode = response;
        });
      } else {
        this.form.rtCode = null;
      }
    }
  }
};
</script>
