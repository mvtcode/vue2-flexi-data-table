<template>
  <div class="dynamic-table-edit box box-grid" :style="{height: `${height}px`}">
    <div class="grid-col-2">
      <div class="edit-columns">
        <div class="justify-content-space-between">
          <h5> Columns </h5>
          <div>
            <button class="btn-plus" :disabled="disabled" @click="onAddColumn">✚</button>
          </div>
        </div>
        <hr style="margin: 5px 0"/>
        <draggable
          tag="ul"
          v-model="columnsEdit"
          handle=".handle"
          ghost-class="ghost"
          :sort="!disabled"
          class="dragArea list-group custom-scroll"
        >
          <li v-for="(element, index) in columnsEdit" :key="index" class="list-group-item" :class="{'hover': element.isDrag, active: activeIndex === index}" @click="!disabled && (activeIndex = index)">
            <div class="label align-items-center" @drop="e => onDrop(e, element, index)" @dragover="e => onDragover(e, element)" @dragleave="e => onDragleave(e, element)">
              <div class="align-items-center">
                <span class="handle">☰</span>

                <Popper placement="right-start" arrow class="popper-wrapper">
                  <button class="btn-more" :disabled="disabled">⋯</button>
                  <template #content>
                    <div class="popover-action">
                      <div>
                        <button class="btn-more" :class="{active: (element.align || 'left') === 'left'}" @click="element.align = 'left'">
                          <img :src="AlignLeftIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.align === 'center'}" @click="element.align = 'center'">
                          <img :src="AlignCenterIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.align === 'right'}" @click="element.align = 'right'">
                          <img :src="AlignRightIcon" />
                        </button>
                      </div>
                      <div style="margin-top: 4px">
                        <button class="btn-more" :class="{active: (element.vAlign || 'top') === 'top'}" @click="element.vAlign = 'top'">
                          <img :src="VerticalAlignTopIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.vAlign === 'middle'}" @click="element.vAlign = 'middle'">
                          <img :src="VerticalAlignCenterIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.vAlign === 'bottom'}" @click="element.vAlign = 'bottom'">
                          <img :src="VerticalAlignBottomIcon" />
                        </button>
                      </div>

                      <div style="margin-top: 4px" class="div-input">
                        <label class="label">width:</label> <input type="text" v-model="element.width" placeholder="# px | %"/>
                      </div>
                      <div style="margin-top: 4px" class="div-input">
                        <label class="label">min-width:</label> <input type="text" v-model="element.minWidth" placeholder="# px | %"/>
                      </div>
                      <div style="margin-top: 4px" class="div-input">
                        <label class="label">max-width:</label> <input type="text" v-model="element.maxWidth" placeholder="# px | %"/>
                      </div>
                    </div>
                  </template>
                </Popper>
                
                <input :disabled="disabled" class="input-title" type="text" v-model="element.title" placeholder="Column name"/>
              </div>
              <ul class="list-selected-field">
                <li v-for="(vfCode, index) in element.fieldCodes" :key="index">
                  <img v-if="mapFieldInfo[vfCode]?.vfType === VfType.ICON" class="icon-selected":src="mapFieldInfo[vfCode]?.value" />
                  <span v-else>{{ mapFieldInfo[vfCode]?.vfTitle }}</span>
                </li>
                <li v-show="!element.fieldCodes.length" class="no-data">Kéo field vào đây</li>
              </ul>
            </div>
            <div>
              <button class="btn btn-close" @click.stop="closeIndex(index)" :disabled="disabled">
                ✘
              </button>
            </div>
          </li>
        </draggable>
      </div>

      <div class="edit-columns">
        <h5>Fields</h5>
        <hr style="margin: 5px 0"/>
        <ul class="list-field custom-scroll">
          <li v-for="field in listFields" :key="field.field">
            <div class="label">{{ field.title }}:</div>
            <div class="item" draggable="true" @dragstart="e => onDragstart(e, vfield)" v-for="vfield in field.variants" :key="vfield.vfCode" @dblclick="onAddingField(vfield)"> {{ vfield.vfTitle }} </div>
          </li>
        </ul>
      </div>

      <div class="edit-columns etc-field custom-scroll">
        <div>
          <h5>Separator</h5>
          <hr style="margin: 5px 0"/>
          <ul class="list-field-symbol">
            <li v-for="field in symbols" :key="field.vfAcutalField">
              <div @dblclick="onAddingField(field)" class="item" draggable="true" @dragstart="e => onDragstart(e, field)"> {{ field.vfTitle }} </div>
            </li>
          </ul>
        </div>

        <div style="margin-top: 10px">
          <h5>Actions</h5>
          <hr style="margin: 5px 0"/>
          <ul class="list-field-symbol">
            <li v-for="field in actions" :key="field.vfAcutalField">
              <div @dblclick="onAddingField(field)" class="item btn" draggable="true" @dragstart="e => onDragstart(e, field)"> {{ field.vfTitle }} </div>
            </li>
          </ul>
        </div>
        
        <div style="margin-top: 10px">
          <h5>Icons</h5>
          <hr style="margin: 5px 0"/>
          <ul class="list-field-symbol">
            <li v-for="field in icons" :key="field.vfAcutalField">
              <img @dblclick="onAddingField(field)" :src="field.value" class="icon" draggable="true" @dragstart="e => onDragstart(e, field)"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import { toJson } from '@/utils/parse';
import { symbols } from '@/constants/symbols';
import AlignLeftIcon from '@/assets/icons/align-left.svg';
import AlignCenterIcon from '@/assets/icons/align-center.svg';
import AlignRightIcon from '@/assets/icons/align-right.svg';
import VerticalAlignTopIcon from '@/assets/icons/vertal-align-top.svg';
import VerticalAlignCenterIcon from '@/assets/icons/vertal-align-center.svg';
import VerticalAlignBottomIcon from '@/assets/icons/vertal-align-bottom.svg';
import '@/assets/style.scss';
import { VfType } from '@/interfaces/tables';

export default {
  name: 'DynamicTableEdit',
  components: {
    draggable,
    Popper,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    vfFields: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
      required: true,
    },
    icons: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 390,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeIndex: -1,
      VfType,
      symbols,
    };
  },

  computed: {
    columnsEdit: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue);
      }
    },

    listFields() {
      const mapField = {};
      const list = [];
      for(const vfField of this.vfFields) {
        const vfAcutalField = vfField?.vfAcutalField || '';
        if (mapField[vfAcutalField] === undefined) {
          list.push({
            title: vfField.vfActualFieldTitle || '',
            field: vfAcutalField,
            variants: [vfField],
          });

          mapField[vfAcutalField] = list.length - 1;
        } else {
          list[mapField[vfAcutalField]].variants.push(vfField);
        }
      }

      return list;
    },

    columnsTemplate() {
      return [...this.symbols, ...this.actions, ...this.icons, ...this.vfFields];
    },

    mapFieldInfo() {
      return this.columnsTemplate.reduce((map, field) => {
        map[field.vfCode] = field;
        return map;
      }, {});
    },
  },

  methods: {
    onAddColumn() {
      emit('update:modelValue', [
        ...this.columnsEdit,
        {
          title: '',
          fieldCodes: [],
          isDrag: false,
        }
      ]);
    },

    onDragstart(e, vfield) {
      e.dataTransfer.setData('text/plain', JSON.stringify(vfield));
    },
    
    onDragover(e, colum) {
      if (this.disabled) {
        return false;
      }
      e.preventDefault();
      colum.isDrag = true;
    },

    onDragleave(e, colum) {
      if (this.disabled) {
        return false;
      }
      e.preventDefault();
      colum.isDrag = false;
    },

    onDrop(e, colum, index) {
      if (this.disabled) {
        return false;
      }
      e.preventDefault();
      const data = toJson(e.dataTransfer.getData("text"));
      if (data && data.vfCode) {
        colum.fieldCodes.push(data.vfCode);
      }
      colum.isDrag = false;

      this.activeIndex = index;
    },

    closeIndex(index) {
      const values = this.columnsEdit;
      const column = values[index];
      if (column.fieldCodes.length > 0) {
        column.fieldCodes.pop();
      } else {
        values.splice(index, 1);
        this.activeIndex = -1;
      }
      this.$emit('input', values);
    },

    onAddingField(field) {
      if (this.disabled) return;
      if (this.activeIndex >= 0) {
        const column = this.columnsEdit[this.activeIndex];
        column && column.fieldCodes.push(field.vfCode);
      } else {
        this.$emit('error', 'Hãy chọn column để thêm');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  &.box-grid {
    padding: 10px;
    // height: 390px;
  }
}

.dynamic-table {
  font-size: 12px;
}

.grid-col-2 {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr;
  height: calc(100% - 10px);
  // height: 100%;

  .edit-columns {
    border: 1px solid #DDD;
    border-radius: 5px;
    padding: 5px;
    width: calc(100% - 15px);
    min-height: calc(100% - 15px);
    height: 100%;

    &.etc-field {
      overflow: auto;
    }
    
    h5 {
      margin: 0;
    }

    .btn-plus {
      width: 30px;
      padding: 1px 0;
      cursor: pointer;
      color: rgb(35, 32, 211);
      border: 1px solid;
      border-radius: 5px;
    }

    ul.list-field {
      padding-left: 0;
      list-style: none;
      margin: 0;
      max-height: calc(100% - 33px);
      overflow: auto;
      li {
        border-radius: 5px;
        white-space: nowrap;
        padding: 2px 4px;
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 12px;

        &:first-child {
          margin-left: 4px;
        }

        &.no-data {
          color: #999;
        }

        .label {

        }
        .item {
          border-radius: 5px;
          border: 1px solid #DDD;
          padding: 2px 4px;
          margin-left: 4px;
          min-width: 20px;
          text-align: center;
          cursor: grab;
        }
      }

      li + li {
        margin-left: 4px;
      }
    }

    ul.list-field-symbol {
      padding-left: 0;
      list-style: none;
      margin: 0;
      display: block;
      min-width: 20px;
      li {
        display: inline-block;
        margin-bottom: 4px;

        .item, .icon {
          border-radius: 5px;
          border: 1px solid #DDD;
          padding: 2px 4px;
          margin-left: 4px;
          min-width: 20px;
          text-align: center;
          cursor: grab;
        }

        .icon {
          height: 18px;
        }
      }
    }
  }

  .edit-columns + .edit-columns {
    margin-left: 5px;
  }
}

ul.list-group {
  padding-left: 0;
  height: calc(100% - 33px);
  overflow-y: auto;
  margin: 0;
  list-style: none;
  li.list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-top: 4px;
    border: 1px solid #DDD;
    border-radius: 5px;

    &.hover {
      border-color: #F00;
    }

    &.sortable-chosen {
      border-color: #F00;
      cursor: move;
    }
    &.active {
      border-color: #94d53b;
    }

    .label {
      width: 100%;
      .input-title {
        border: none;
        border-bottom: 1px #ddd dotted;
        outline: none;
        width: 120px;
        margin-left: 4px;
      }

      .handle {
        cursor: move;
      }

      .btn-more {
        background: none;
        border-radius: 5px;
        border: 1px solid #DDD;
        cursor: pointer;
        margin: 0 2px;

        &:hover, &.active {
          color: #2320d3;
          border-color: #2320d3;
        }

        img {
          width: 20px;
          width: 20px
        }
      }

      ul.list-selected-field {
        padding-left: 0;
        list-style: none;
        margin: 0;
        li {
          border: 1px solid #DDD;
          border-radius: 5px;
          white-space: nowrap;
          padding: 2px 4px;
          display: inline-block;
          margin-bottom: 4px;
          font-size: 12px;
          min-width: 20px;
          text-align: center;

          &:first-child {
            margin-left: 4px;
          }

          &:has(.icon-selected) {
            padding: 2px;
          }

          .icon-selected {
            height: 12px;
            margin-bottom: -2px;
          }

          &.no-data {
            border: none;
            color: #999;
          }
        }
        li + li {
          margin-left: 4px;
        }
      }
    }

    .btn {
      width: 30px;
      cursor: pointer;
      border: 1px solid;
      border-radius: 5px;

      &.btn-edit {
        color: #9290f0;
      }

      &.btn-close {
        color: #F00;
      }
    }

    .btn + .btn {
      margin-left: 4px;
    }
  }
}

.popper-wrapper {
  border: none !important;
  margin: 0 1px !important;
}

.popover-action {
  width: max-content;
  .div-input {
    display: flex;
    .label {
      width: 90px;
      margin-right: 10px;
    }
    input[type="text"] {
      width: 55px;
      outline: none;
      border: 1px solid #AAA;
      border-radius: 3px;
    }
  }
}
</style>