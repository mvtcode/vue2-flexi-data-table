<template>
  <div>
    <DynamicTable fixed :height="250" :columns="columnsEdit" :templates="[...vfFields, ...icons, ...actions]" :data="data" @onCta="onCta" />

    <hr style="margin: 20px 0 0"/>

    <div class="grid">
      <div class="grid-item">
        <h4>Build columns</h4>
        <TableEditor v-model="columnsEdit" :vfFields="vfFields" :actions="actions" :icons="icons" />
      </div>
      <div class="grid-item">
        <h4>Template columns</h4>
        <textarea v-model="vfFieldsEdit" class="custom-scroll" />
      </div>
      <div class="grid-item">
        <h4>Table data</h4>
          <textarea v-model="dataEdit" class="custom-scroll" />
      </div>
    </div>

    <div class="grid-2-col">
      <div class="grid-item">
        <h4 style="margin-bottom: 10px;">Columns</h4>
        <div class="box column-out custom-scroll">
          {{ columnShow }}
        </div>
      </div>
      <div class="grid-item">
        <h4 style="margin-bottom: 10px;">Actions log</h4>
        <div class="box column-out custom-scroll">
          <pre>{{ actionSelects.join('\n') }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicTable from '@/components/DynamicTable.vue';
import TableEditor from '@/components/TableEditor.vue';
import { VfType } from '@/interfaces/tables.js';

export default {
  name: 'MyComponent',
  components: {
    DynamicTable,
    TableEditor
  },
  data() {
    return {
      vfFields: [
        {
          vfTitle: 'Mã SV',
          vfCode: 'id',
          vfType: VfType.DATA,
          vfAcutalField: 'id',
          vfActualFieldTitle: 'Mã SV',
        },
        {
          vfTitle: 'MSV: {{value}}',
          vfCode: 'id2',
          vfType: VfType.DATA,
          vfAcutalField: 'id',
          vfActualFieldTitle: 'Mã SV',
          templateShow: 'MSV: {{value}}',
        },
        {
          vfTitle: 'Func Show',
          vfCode: 'idFun',
          vfType: VfType.DATA,
          vfAcutalField: 'id',
          vfActualFieldTitle: 'Mã SV',
          templateShow: 'MSV: {{value}}',
          vfRenderFunc(row) {
            return `ID: <strong style="color: #F00">${row.id}</strong>`;
          },
        },
        {
          vfTitle: 'Họ Tên',
          vfCode: 'name',
          vfType: VfType.DATA,
          vfAcutalField: 'name',
          vfActualFieldTitle: 'Họ tên',
        },
        {
          vfTitle: 'Tuổi',
          vfCode: 'age',
          vfType: VfType.DATA,
          vfAcutalField: 'age',
          vfActualFieldTitle: 'Tuổi',
        },
        {
          vfTitle: 'Giới tính',
          vfCode: 'gender',
          vfType: VfType.DATA,
          vfAcutalField: 'gender',
          vfActualFieldTitle: 'Giới tính',
        },
        {
          vfTitle: 'Giới tính color',
          vfCode: 'gender2',
          vfType: VfType.DATA,
          vfAcutalField: 'gender',
          vfActualFieldTitle: 'Giới tính',
          vfRenderFunc(row) {
            return `<span style="color: ${row.gender === 'Nam' ? 'red' : 'blue'}">${row.gender}</span>`;
          },
        },
        {
          vfTitle: 'Ngành học',
          vfCode: 'major',
          vfType: VfType.DATA,
          vfAcutalField: 'major',
          vfActualFieldTitle: 'Ngành học',
        },
        {
          vfTitle: 'Khóa học default',
          vfCode: 'courses',
          vfType: VfType.DATA,
          vfAcutalField: 'courses',
          vfActualFieldTitle: 'Khóa học',
        },
        {
          vfTitle: 'Khóa học dọc',
          vfCode: 'courses2',
          vfType: VfType.DATA,
          vfAcutalField: 'courses',
          vfActualFieldTitle: 'Khóa học',
          templateShow: '<div>{{$item}}</div>',
        },
        {
          vfTitle: 'Khóa học Func',
          vfCode: 'coursesFunc',
          vfType: VfType.DATA,
          vfAcutalField: 'courses',
          vfActualFieldTitle: 'Khóa học',
          vfRenderFunc(row) {
            return row.courses.join(' | ');
          },
        },
        {
          vfTitle: 'Điểm trung bình',
          vfCode: 'gpa',
          vfType: VfType.DATA,
          vfAcutalField: 'GPA',
          vfActualFieldTitle: 'Điểm trung bình',
        },
        {
          vfTitle: 'ĐTB: {{value}}',
          vfCode: 'gpa2',
          vfType: VfType.DATA,
          vfAcutalField: 'GPA',
          vfActualFieldTitle: 'Điểm trung bình',
          templateShow: 'ĐTB: {{value}}',
        },
        {
          vfTitle: 'Trạng thái',
          vfCode: 'status',
          vfType: VfType.DATA,
          vfAcutalField: 'status',
          enum: {
            dropout: 'Thôi học',
            studying: 'Đang học',
            graduate: 'Tốt nghiệp',
          },
          vfActualFieldTitle: 'Trạng thái',
        },
        {
          vfTitle: 'Tỉnh/TP',
          vfCode: 'provinceName',
          vfType: VfType.DATA,
          vfAcutalField: 'address.provinceName',
          vfActualFieldTitle: 'Tỉnh/TP',
        },
        {
          vfTitle: 'Quận/Huyện',
          vfCode: 'districtName',
          vfType: VfType.DATA,
          vfAcutalField: 'address.districtName',
          vfActualFieldTitle: 'Quận/Huyện',
        },
      ],
      actions: [
        {
          vfTitle: 'Xem',
          vfCode: 'detail',
          vfType: VfType.ACTION,
          vfActualFieldTitle: 'Xem',
        },
        {
          vfTitle: 'Sửa',
          vfCode: 'update',
          vfType: VfType.ACTION,
          vfActualFieldTitle: 'Sửa',
        },
        {
          vfTitle: 'Xóa',
          vfCode: 'delete',
          vfType: VfType.ACTION,
          vfActualFieldTitle: 'Xóa',
        },
        {
          vfTitle: 'Đổi giới tính',
          vfCode: 'chagnegender',
          vfType: VfType.ACTION,
          vfActualFieldTitle: 'Đổi giới tính',
        },
      ],
      icons: [
        {
          vfTitle: 'bookmark',
          vfCode: 'bookmark',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'bookmark',
          value: '/icons/bookmark.png',
        },
        {
          vfTitle: 'envelope',
          vfCode: 'envelope',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'envelope',
          value: '/icons/envelope.png',
        },
        {
          vfTitle: 'home',
          vfCode: 'home',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'home',
          value: '/icons/home.png',
        },
        {
          vfTitle: 'marker',
          vfCode: 'marker',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'marker',
          value: '/icons/marker.png',
        },
        {
          vfTitle: 'paper-plane',
          vfCode: 'paper-plane',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'paper-plane',
          value: '/icons/paper-plane.png',
        },
        {
          vfTitle: 'phone-call',
          vfCode: 'phone-call',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'phone-call',
          value: '/icons/phone-call.png',
        },
        {
          vfTitle: 'settings',
          vfCode: 'settings',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'settings',
          value: '/icons/settings.png',
        },
        {
          vfTitle: 'star',
          vfCode: 'star',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'star',
          value: '/icons/star.png',
        },
        {
          vfTitle: 'user',
          vfCode: 'user',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'user',
          value: '/icons/user.png',
        },
        {
          vfTitle: 'users-alt',
          vfCode: 'users-alt',
          vfType: VfType.ICON,
          vfActualFieldTitle: 'users-alt',
          value: '/icons/users-alt.png',
        },
      ],
      data: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          age: 20,
          gender: 'Nam',
          major: 'Khoa học máy tính',
          GPA: 3.5,
          courses: ['Introduction to Programming', 'Data Structures', 'Algorithms'],
          status: 'dropout',
          address: {
            prorinceId: 1,
            provinceName: 'Hà Nội',
            districtId: 1,
            districtName: 'Hoàng Mai',
          },
        },
        {
          id: 2,
          name: 'Trần Thị B',
          age: 21,
          gender: 'Nữ',
          major: 'Kinh doanh',
          GPA: 3.2,
          courses: ['Marketing', 'Accounting', 'Business Communication'],
          status: 'studying',
          address: {
            prorinceId: 1,
            provinceName: 'Hà Nội',
            districtId: 2,
            districtName: 'Cầu Giấy',
          },
        },
        {
          id: 3,
          name: "Lê Văn C",
          age: 19,
          gender: "Nam",
          major: "Kỹ thuật điện",
          GPA: 3.8,
          courses: ["Circuit Theory", "Digital Electronics", "Power Systems"],
          status: 'graduate',
          address: {
            prorinceId: 2,
            provinceName: 'HCM',
            districtId: 1,
            districtName: 'Quận 1',
          }
        },
        {
          id: 4,
          name: "Lê Văn D",
          age: 19,
          gender: "Nam",
          major: "Kỹ thuật điện",
          GPA: 3.8,
          courses: ["Circuit Theory", "Digital Electronics", "Power Systems"],
          status: 'graduate',
          address: {
            prorinceId: 2,
            provinceName: 'HCM',
            districtId: 1,
            districtName: 'Quận 1',
          }
        },
        {
          id: 5,
          name: "Lê Văn E",
          age: 19,
          gender: "Nam",
          major: "Kỹ thuật điện",
          GPA: 3.8,
          courses: ["Circuit Theory", "Digital Electronics", "Power Systems"],
          status: 'graduate',
          address: {
            prorinceId: 2,
            provinceName: 'HCM',
            districtId: 1,
            districtName: 'Quận 1',
          }
        }
      ],
      columns: [
      { "title": "Mã sinh viên", "fieldCodes": [ "idFun" ] }, { "title": "Họ và tên", "fieldCodes": [ "name", "space", "minus", "space", "detail" ] }, { "title": "Ngành học", "fieldCodes": [ "major", "newline", "gpa2" ] }, { "title": "Khóa học", "fieldCodes": [ "courses2" ] }, { "title": "Địa chỉ", "fieldCodes": [ "districtName", "space", "minus", "space", "provinceName" ] }, { "title": "Giới tính", "fieldCodes": [ "gender2", "newline", "age" ] }, { "title": "Trạng thái", "fieldCodes": [ "star", "space", "status" ] }, { "title": "Actions", "fieldCodes": [ "detail", "space", "vertical", "space", "update", "space", "vertical", "space", "delete", "newline", "chagnegender" ] }
      ],
      columnsEdit: [],
      actionSelects: []
    };
  },

  created() {
    this.columnsEdit = this.columns.map(column => {
      return {
        ...column,
        isDrag: false,
      }
    });
  },

  computed: {
    vfFieldsEdit: {
      get() {
        return JSON.stringify(this.vfFields, null, 2);
      },
      set(value) {
        this.vfFields = JSON.parse(value);
      }
    },
    dataEdit: {
      get() {
        return JSON.stringify(this.data, null, 2);
      },
      set(value) {
        this.data = JSON.parse(value);
      }
    },
    columnShow() {
      return this.columnsEdit.map(column => {
        const { isDrag, ...columnInfo } = column;
        return columnInfo;
      });
    }
  },
  methods: {
    onCta(action, row, index) {
      this.actionSelects.push(`Event: ${action} | index: ${index} | id: ${row.id}`);
    },
    renderFuncGender(row) {
      return `<span style="color: ${row.gender === 'Nam' ? 'red' : 'blue'}">${row.gender}</span>`;
    },
    renderFuncCourses(row) {
      return row.courses.join(' | ');
    },
    renderFuncID(row) {
      return `ID: <strong style="color: #F00">${row.id}</strong>`;
    }
  }
}
</script>

<style lang="scss" scoped>
pre {
  margin: 0;
  padding: 0;
}

.link {
  color: blue;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;

  h4 {
    margin-bottom: 10px;
  }
  
  .grid-item + .grid-item {
    margin-left: 10px;
  }
}

.grid-2-col {
  display: grid;
  grid-template-columns: 4fr 1fr;

  h4 {
    margin-bottom: 10px;
  }
  
  .grid-item {
    .column-out {
      overflow-y: auto;
    }
  }

  .grid-item + .grid-item {
    margin-left: 10px;
  }
}

textarea {
  resize: none;
  width: calc(100% - 10px);
  height: 400px;
  outline-color: #DDD;
  border: 1px solid #DDD;
  border-radius: 5px;
  padding: 5px;
}

.box {
  &.column-out {
    height: 100px;
    padding: 10px;
  }
}
</style>
