import { mount } from '@vue/test-utils'
import IbpsIconSvg from '@/components/ibps-icon-svg/index.vue'

describe('ibps-icon-svg', () => {
  // 存在且是Vue组件实例
  it('is a vue instance', () => {
    const wrapper = mount(IbpsIconSvg, {
      propsData: {
        name: 'add'
      }
    })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // props
  it('has props', () => {
    const wrapper = mount(IbpsIconSvg, {
      propsData: {
        name: 'add'
      }
    })

    expect(wrapper.props().name).toEqual('add')
  })
})
