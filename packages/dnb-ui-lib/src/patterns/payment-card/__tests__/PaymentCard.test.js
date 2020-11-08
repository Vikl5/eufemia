/**
 * Component Test
 *
 */

import React from 'react'
import {
  mount,
  // fakeProps,
  axeComponent,
  toJson,
  loadScss
} from '../../../core/jest/jestSetup'
import Component from '../PaymentCard'

// const defaultProps = fakeProps(require.resolve('../PaymentCard'), {
//   optional: true
// })
const defaultProps = {
  product_code: 'NK1',
  card_number: '************1337'
}

describe('PaymentCard', () => {
  const Comp = mount(<Component {...defaultProps} />)

  it('have to match snapshot', () => {
    expect(toJson(Comp)).toMatchSnapshot()
  })

  it('has to have a figcaption', () => {
    // const Comp = mount(<Component product_code="DNB" card_number="************1337" />)
    expect(Comp.find('figcaption').text()).toBe('DNB Kortet')
  })

  it('should validate with ARIA rules', async () => {
    expect(await axeComponent(Comp)).toHaveNoViolations()
  })
})

describe('PaymentCard scss', () => {
  it('have to match snapshot', () => {
    const scss = loadScss(
      require.resolve('../style/dnb-payment-card.scss')
    )
    expect(scss).toMatchSnapshot()
  })
  it('have to match default theme snapshot', () => {
    const scss = loadScss(
      require.resolve('../style/themes/dnb-payment-card-theme-ui.scss')
    )
    expect(scss).toMatchSnapshot()
  })
})
