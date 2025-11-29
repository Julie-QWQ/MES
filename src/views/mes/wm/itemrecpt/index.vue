<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="入库单编号" prop="recptCode">
        <el-input
          v-model="queryParams.recptCode"
          placeholder="请输入入库单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="供应商名称" prop="vendorName">
        <el-input
          v-model="queryParams.vendorName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="入库日期" prop="recptDate">
        <el-date-picker clearable
          v-model="queryParams.recptDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择入库日期">
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
          v-hasPermi="['mes:wm:itemrecpt:add']"
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
          v-hasPermi="['mes:wm:itemrecpt:edit']"
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
          v-hasPermi="['mes:wm:itemrecpt:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mes:wm:itemrecpt:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itemrecptList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="入库单编号" align="center" prop="recptCode" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:wm:itemrecpt:query']"
          >{{scope.row.recptCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="入库单名称" align="center" prop="recptName" />
      <el-table-column label="供应商编码" align="center" prop="vendorCode" />
      <el-table-column label="供应商名称" align="center" prop="vendorName" />
      <el-table-column label="仓库" align="center" prop="warehouseName" />
      <el-table-column label="入库日期" align="center" prop="recptDate" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recptDate, '{y}-{m}-{d}') }}</span>
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
            v-hasPermi="['mes:wm:itemrecpt:execute']"
          >执行入库</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.status =='PREPARE'"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:wm:itemrecpt:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status =='PREPARE'"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:wm:itemrecpt:remove']"
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

    <!-- 添加或修改物料入库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="入库单编号" prop="recptCode">
              <el-input v-model="form.recptCode" placeholder="请输入入库单编号" :disabled="optType == 'view' || form.status !='PREPARE'" />
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
            <el-form-item label="入库单名称" prop="recptName">
              <el-input v-model="form.recptName" placeholder="请输入入库单名称" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="入库日期" prop="recptDate">
              <el-date-picker clearable
                v-model="form.recptDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择入库日期"
                :disabled="optType == 'view' || form.status !='PREPARE'">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="vendorName">
              <el-input v-model="form.vendorName" placeholder="请选择供应商" :disabled="optType == 'view' || form.status !='PREPARE'">
                <el-button slot="append" icon="el-icon-search" @click="handleVendorSelect" v-if="optType != 'view' && form.status =='PREPARE'"></el-button>
              </el-input>
            </el-form-item>
            <VendorSelect ref="vendorSelect" @onSelected="onVendorSelected"></VendorSelect>
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
            <el-form-item label="采购订单号" prop="poCode">
              <el-input v-model="form.poCode" placeholder="请输入采购订单号" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IQC检验单" prop="iqcCode">
              <el-input v-model="form.iqcCode" placeholder="请选择IQC检验单" :disabled="optType == 'view' || form.status !='PREPARE'">
                <el-button slot="append" icon="el-icon-search" @click="handleIqcSelect" v-if="optType != 'view' && form.status =='PREPARE'"></el-button>
              </el-input>
            </el-form-item>
            <IqcSelect ref="iqcSelect" @onSelected="onIqcSelected"></IqcSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库仓库" prop="warehouseId">
              <el-cascader v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                @change="handleWarehouseChanged"
                :disabled="optType == 'view' || form.status !='PREPARE'"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :disabled="optType == 'view' || form.status !='PREPARE'" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="form.recptId !=null" content-position="center">物料明细</el-divider>
        <el-card shadow="always" v-if="form.recptId !=null" class="box-card">
          <ItemrecptLine ref="line" :recptId="form.recptId" :warehouseId="form.warehouseId" :locationId="form.locationId" :areaId="form.areaId" :optType="optType"></ItemrecptLine>
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
import { listItemrecpt, getItemrecpt, delItemrecpt, addItemrecpt, updateItemrecpt, execute } from "@/api/mes/wm/itemrecpt";
import { getTreeList } from "@/api/mes/wm/warehouse";
import { genCode } from "@/api/system/autocode/rule";
import VendorSelect from "@/components/vendorSelect/single.vue";
import IqcSelect from "@/components/iqcSelect/single.vue";
import ItemrecptLine from "./line.vue";

export default {
  name: "Itemrecpt",
  dicts: ['mes_order_status'],
  components: { VendorSelect, IqcSelect, ItemrecptLine },
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
      // 物料入库单表格数据
      itemrecptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recptCode: null,
        recptName: null,
        iqcId: null,
        iqcCode: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        recptDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recptCode: [
          { required: true, message: "入库单编号不能为空", trigger: "blur" }
        ],
        recptName: [
          { required: true, message: "入库单名称不能为空", trigger: "blur" }
        ],
        vendorId: [
          { required: true, message: "请选择供应商", trigger: "blur" }
        ],
        recptDate: [
          { required: true, message: "请选择入库日期", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询物料入库单列表 */
    getList() {
      this.loading = true;
      listItemrecpt(this.queryParams).then(response => {
        this.itemrecptList = response.rows;
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
        recptId: null,
        recptCode: null,
        recptName: null,
        iqcId: null,
        iqcCode: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        vendorNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        recptDate: new Date(),
        status: "PREPARE",
        poCode: null,
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
      this.ids = selection.map(item => item.recptId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加物料入库单";
      this.optType = "add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recptId = row.recptId || this.ids;
      getItemrecpt(recptId).then(response => {
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
        this.title = "修改物料入库单";
        this.optType = "edit";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recptId != null) {
            updateItemrecpt(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addItemrecpt(this.form).then(response => {
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
      const recptIds = row.recptId || this.ids;
      this.$modal.confirm('是否确认删除物料入库单编号为"' + recptIds + '"的数据项？').then(function() {
        return delItemrecpt(recptIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/mes/wm/itemrecpt/export', {
        ...this.queryParams
      }, `itemrecpt_${new Date().getTime()}.xlsx`);
    },
    /** 查询明细按钮操作 */
    handleView(row) {
      this.reset();
      const recptId = row.recptId;
      getItemrecpt(recptId).then(response => {
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
        this.title = "查看物料入库单信息";
        this.optType = "view";
      });
    },
    /** 执行入库 */
    handleExecute(row) {
      const recptId = row.recptId || this.ids;
      this.$modal.confirm('确认执行入库？').then(function() {
        return execute(recptId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("入库成功");
      }).catch(() => {});
    },
    /** 选择供应商 */
    handleVendorSelect() {
      this.$refs.vendorSelect.showFlag = true;
    },
    onVendorSelected(row) {
      if (row != undefined && row != null) {
        this.form.vendorId = row.vendorId;
        this.form.vendorCode = row.vendorCode;
        this.form.vendorName = row.vendorName;
        this.form.vendorNick = row.vendorNick;
      }
    },
    /** 选择IQC检验单 */
    handleIqcSelect() {
      this.$refs.iqcSelect.showFlag = true;
    },
    onIqcSelected(row) {
      if (row != undefined && row != null) {
        this.form.iqcId = row.iqcId;
        this.form.iqcCode = row.iqcCode;
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
        genCode('ITEM_RECPT_CODE').then(response => {
          this.form.recptCode = response;
        });
      } else {
        this.form.recptCode = null;
      }
    }
  }
};
</script>
