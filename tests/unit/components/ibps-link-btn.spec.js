import { mount } from '@vue/test-utils'
import IbpsLinkBtn from '@/components/ibps-link-btn/index.vue'

describe('ibps-link-btn', () => {
  // 存在且是Vue组件实例
  it('is a vue instance', () => {
    const wrapper = mount(IbpsLinkBtn, {
      stubs: ['el-button-group', 'el-button', 'ibps-icon']
    })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // props
  it('has props', () => {
    const wrapper = mount(IbpsLinkBtn, {
      stubs: ['el-button-group', 'el-button', 'ibps-icon'],
      propsData: {
        title: 'title',
        icon: 'icon',
        link: 'link'
      }
    })

    expect(wrapper.props().title).toEqual('title')
    expect(wrapper.props().icon).toEqual('icon')
    expect(wrapper.props().link).toEqual('link')
  })
})
