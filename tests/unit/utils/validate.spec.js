import { validateMobile } from '@/utils/validate.js'
describe('Utils:validate', () => {
  it('validateMobile', () => {
    expect(validateMobile('15992494491')).toBe(true)
    expect(validateMobile('14092411111')).toBe(true)
    expect(validateMobile('1599249449x')).toBe(false)
  })
})
