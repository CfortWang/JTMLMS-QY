
<template>
  <span>
    <el-dialog
      :title="$t('plugins.api-base-url.title')"
      :visible.sync="active"
      width="400px"
      custom-class="ibps-api-base-url-controller"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-scrollbar>
        <div class="wrapper">
          <div
            v-for="option of options"
            :key="option.value"
            class="item"
          >
            <el-button
              size="default"
              :type="isItemActive(option.value) ? 'primary' : 'default'"
              style="width: 100%;"
              @click="onSelect(option.value,option.single)"
            >
              <div flex="main:justify cross:center">
                <div flex="dir:top cross:top">
                  <div class="item-name">
                    {{ getTitle(option.name) }}
                    ( {{ option.single? $t('plugins.api-base-url.constants.type.single') :$t('plugins.api-base-url.constants.type.non-single') }} )
                  </div>
                  <div class="item-value">
                    {{ option.value }}
                  </div>
                </div>
                <span v-if="isItemActive(option.value)">
                  <ibps-icon class="item-icon" name="check-circle" />
                </span>
                <span
                  v-else-if="option.type === 'custom'"
                  @click.stop="onRemove(option.value)"
                >
                  <ibps-icon class="item-icon" name="close" />
                </span>
              </div>
            </el-button>
          </div>
        </div>
      </el-scrollbar>
      <el-divider>{{ $t('plugins.api-base-url.or') }}</el-divider>
      <div flex="main:justify cross:center">
        <el-input
          v-model="customBaseUrl"
          class="ibps-mr-5"
        />
        <el-tooltip
          effect="dark"
          :content="$t('plugins.api-base-url.singleApp')"
          placement="bottom"
        >
          <el-switch v-model="customSingle" />
        </el-tooltip>
        <el-button
          :disabled="customBaseUrl.length === 0"
          @click="onSetCustom"
        >{{ $t('plugins.api-base-url.button.ok') }}</el-button>
      </div>
      <el-divider />
      <el-button
        type="primary"
        style="width:100%;"
        @click="onConfirm"
      >{{ $t('plugins.api-base-url.button.confirm') }}</el-button>
    </el-dialog>
    <span @click="onOpen">
      <slot />
    </span>
  </span>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { SINGLE_APP, BASE_API } from '@/api/baseUrl'
export default {
  name: 'ibps-api-base-url-controller',
  data() {
    return {
      active: false,
      customBaseUrl: '',
      customSingle: '',
      baseUrl: this.base,
      baseSingle: this.single
    }
  },
  computed: {
    ...mapState('ibps/api', [
      'base'
    ]),
    ...mapState('ibps/api', [
      'single'
    ]),
    ...mapGetters('ibps/api', [
      'options'
    ])
  },
  methods: {
    ...mapActions('ibps/api', {
      baseUrlCustom: 'custom',
      baseUrlSet: 'set',
      baseUrlOptionRemove: 'remove'
    }),
    onOpen() {
      this.customBaseUrl = BASE_API()
      this.customSingle = SINGLE_APP()

      this.baseUrl = this.base
      this.baseSingle = this.single

      this.active = true
    },
    onSelect(value, single) {
      this.baseUrl = value
      this.baseSingle = single
    },
    onSetCustom() {
      this.baseUrlCustom({
        baseUrl: this.customBaseUrl,
        single: this.customSingle
      })
    },
    onConfirm() {
      this.active = false
      if (this.base === this.baseUrl) {
        return
      }
      this.baseUrlSet({
        baseUrl: this.baseUrl,
        single: this.baseSingle,
        vm: this
      })
      this.$router.replace('/refresh')
    },
    onRemove(value) {
      this.baseUrlOptionRemove(value)
    },
    isItemActive(value) {
      return this.baseUrl === value
    },
    getTitle(name) {
      const nameLower = name.toLowerCase()
      if (this.$te('plugins.api-base-url.constants.env.' + nameLower)) {
        return this.$t('plugins.api-base-url.constants.env.' + nameLower)
      }
      return name
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-api-base-url-controller {
  .el-dialog__body {
    .wrapper {
      max-height: 220px;
      .item {
        &:last-child {
          .el-button {
            margin-bottom: 0px;
          }
        }
        .el-button {
          margin-bottom: 10px;
          .item-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .item-value {
            font-size: 12px;
          }
          .item-icon {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>
