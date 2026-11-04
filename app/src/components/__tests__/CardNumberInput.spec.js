import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardNumberInput from '../CardNumberInput.vue'

describe('CardNumberInput', () => {
  it('signale un numéro trop court', async () => {
    const wrapper = mount(CardNumberInput, { props: { modelValue: '' } })

    await wrapper.setProps({ modelValue: '29900' })

    expect(wrapper.find('.error').text()).toContain('13 chiffres')
    expect(wrapper.emitted('validity').at(-1)).toEqual([false])
  })

  it('refuse les caractères non numériques', async () => {
    const wrapper = mount(CardNumberInput, { props: { modelValue: '' } })

    await wrapper.setProps({ modelValue: '29900A' })

    expect(wrapper.find('.error').text()).toContain('que des chiffres')
  })

  it('accepte un numéro de 13 chiffres et met à jour le v-model', async () => {
    const wrapper = mount(CardNumberInput, {
      props: { modelValue: '', 'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }) },
    })

    await wrapper.find('input').setValue('2990000000001')

    expect(wrapper.props('modelValue')).toBe('2990000000001')
    expect(wrapper.find('.error').exists()).toBe(false)
    expect(wrapper.emitted('validity').at(-1)).toEqual([true])
  })
})
