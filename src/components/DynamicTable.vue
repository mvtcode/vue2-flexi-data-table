<template>
  <div class="wrapper-table custom-scroll" :class="{fixed: fixed}" :style="{height: fixed ? height + 'px': 'auto'}">
    <table class="dynamic-table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index" :class="{'drag-over': column.isDrag}">
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="(column, index2) in columns" :key="index2" :class="{'drag-over': column.isDrag}" :style="getStyleColumn(column)">
            <div class="td-line" v-html="getValue(row, column, index)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import escapeHtml from 'escape-html';
import '@/assets/style.scss';
import { symbols } from '@/constants/symbols';
import { VfType } from '@/interfaces/tables';

export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    templates: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: 0
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      prefixFunction: 'tdac',
      callFunction: '',
    };
  },
  computed: {
    getStyleColumn() {
      return (column) => {
        const style = {
          'text-align': column.align || 'left',
          'vertical-align': column.vAlign || 'top'
        };
        if (column.width) style.width = column.width;
        if (column.minWidth) style['min-width'] = column.minWidth;
        if (column.maxWidth) style['max-width'] = column.maxWidth;
        return style;
      };
    },
    mapFieldInfo() {
      return [...this.templates, ...symbols].reduce((map, field) => {
        map[field.vfCode] = field;
        return map;
      }, {});
    },
    getValue() {
      return (row, column, index) => {
        const values = [];
        for (const vfCode of column.fieldCodes) {
          const fieldInfo = this.mapFieldInfo[vfCode];
          if (fieldInfo) {
            if (fieldInfo.vfType === VfType.SYMBOL) {
              values.push(fieldInfo.value || '');
              continue;
            }
            if (fieldInfo.vfType === VfType.ACTION) {
              const value = `<span class="btn btn-${fieldInfo.vfAcutalField}" onClick="${this.callFunction}('${fieldInfo.vfCode}', ${index})">${fieldInfo.vfTitle || ''}</span>`;
              values.push(value);
              continue;
            }
            if (fieldInfo.vfType === VfType.ICON) {
              const value = `<img class="icon" src="${fieldInfo.value}"/>`;
              values.push(value);
              continue;
            }
            if (fieldInfo.vfRenderFunc) {
              const vFun = fieldInfo.vfRenderFunc(row, fieldInfo, index, this.callFunction);
              values.push(vFun);
              continue;
            }
            const rowValue = row[fieldInfo.vfAcutalField];
            if (Array.isArray(rowValue)) {
              const vArr = fieldInfo.templateShow ? rowValue.map((item) => this.render(fieldInfo.templateShow, { $item: escapeHtml(item) })).join('') : rowValue.join(', ');
              values.push(vArr);
              continue;
            }
            const objectRow = this.flattenObject(row);
            let value = objectRow[fieldInfo.vfAcutalField || ''];
            if (fieldInfo.enum && Object.keys(fieldInfo.enum).length > 0) {
              value = fieldInfo.enum[value] || value;
              value = escapeHtml(value);
            }
            if (fieldInfo.templateShow) {
              value = this.render(fieldInfo.templateShow, { value: escapeHtml(value) });
            }
            values.push(value);
          }
        }
        return values.join('');
      };
    }
  },
  methods: {
    flattenObject(obj, parentKey = '', result = {}) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const prefixedKey = parentKey ? `${parentKey}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            this.flattenObject(obj[key], prefixedKey, result);
          } else {
            result[prefixedKey] = obj[key];
          }
        }
      }
      return result;
    },
    render(template, values) {
      return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        const value = values[key];
        return value !== undefined && value !== null ? value : match;
      });
    },
    emitAction(action, index) {
      const row = this.data[index];
      this.$emit('onCta', action, row, index);
    },
    setupActionHandler() {
      this.callFunction = `${this.prefixFunction}${Math.floor(Math.random() * 1e6)}`;
      window[this.callFunction] = (action, index) => {
        this.emitAction(action, index);
      };
    },
    removeActionHandler() {
      if (window[this.callFunction]) {
        window[this.callFunction] = undefined;
        delete window[this.callFunction];
      }
    }
  },
  mounted() {
    this.setupActionHandler();
  },
  beforeDestroy() {
    this.removeActionHandler();
  }
};
</script>

<style scoped lang="scss">
.drag-over {
  color: #F00;
}

.icon {
  height: 18px;
}
</style>
