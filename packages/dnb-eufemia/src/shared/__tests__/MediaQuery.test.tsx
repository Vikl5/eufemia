/**
 * MediaQuery Tests
 *
 */

import React from 'react'
import { render, screen, act } from '@testing-library/react'

import MatchMediaMock from 'jest-matchmedia-mock'
import MediaQuery from '../MediaQuery'
import Provider from '../Provider'
import { isMatchMediaSupported as _isMatchMediaSupported } from '../MediaQueryUtils'

const isMatchMediaSupported = _isMatchMediaSupported as jest.Mock

jest.mock('../MediaQueryUtils', () => {
  const orig = jest.requireActual('../MediaQueryUtils')
  return {
    ...orig,
    isMatchMediaSupported: jest.fn(),
  }
})

describe('MediaQuery', () => {
  let matchMedia: MatchMediaMock

  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  beforeEach(() => {
    isMatchMediaSupported.mockReturnValue(true)
  })

  afterEach(() => {
    matchMedia?.clear()
  })

  afterAll(() => {
    matchMedia?.destroy()
  })

  it('should match for query with medium width', () => {
    matchMedia.useMediaQuery('(min-width: 60em) and (max-width: 72em)')

    render(
      <MediaQuery when={{ min: 'medium', max: 'large' }}>
        medium
      </MediaQuery>
    )
    expect(screen.queryByText('medium')).toBeTruthy()
  })

  it('should match for query when different breakpoints are given', () => {
    matchMedia.useMediaQuery(
      '(min-width: 40em) and (max-width: 80em), (min-width: 0) and (max-width: 30rem), (max-width: 90em)'
    )

    render(
      <Provider
        value={{
          breakpoints: {
            medium: '30rem',
            large: '80rem',
          },
        }}
      >
        <MediaQuery
          when={[
            { min: 'small', max: 'x-large' },
            { min: '0', max: 'medium' },
            { max: 'xx-large' },
          ]}
        >
          medium
        </MediaQuery>
      </Provider>
    )

    expect(screen.queryByText('medium')).toBeTruthy()
  })

  it('should match for query when custom breakpoints are given', () => {
    matchMedia.useMediaQuery(
      '(min-width: 0) and (max-width: 20rem), (max-width: 90rem)'
    )

    render(
      <Provider
        value={{
          breakpoints: {
            xsmall: '20rem',
            wide: '90rem',
          },
        }}
      >
        <MediaQuery when={[{ min: '0', max: 'xsmall' }, { max: 'wide' }]}>
          xsmall
        </MediaQuery>
      </Provider>
    )

    expect(screen.queryByText('xsmall')).toBeTruthy()
  })

  it('should match for query when breakpoint is got removed', () => {
    matchMedia.useMediaQuery(
      '(min-width: 0) and (max-width: 20rem), (min-width: 71rem)'
    )

    render(
      <Provider
        value={{
          breakpoints: {
            xsmall: '20rem',
            large: '71rem',
            'x-large': undefined,
          },
        }}
      >
        <MediaQuery
          when={[
            { min: '0', max: 'xsmall' },
            { min: 'large', max: 'x-large' },
          ]}
        >
          xsmall
        </MediaQuery>
      </Provider>
    )

    expect(screen.queryByText('xsmall')).toBeTruthy()
  })

  it('should match for what ever query is given when matchOnSSR is true', () => {
    isMatchMediaSupported.mockReturnValue(false)

    render(
      <MediaQuery matchOnSSR when={{ min: 'what-every' }}>
        medium
      </MediaQuery>
    )

    expect(screen.queryByText('medium')).toBeTruthy()
  })

  it('should match for query with medium and large width', () => {
    matchMedia.useMediaQuery(
      '(min-width: 60em) and (max-width: 72em), (min-width: 72em) and (max-width: 80em)'
    )

    render(
      <MediaQuery
        when={[
          { min: 'medium', max: 'large' },
          { min: 'large', max: 'x-large' },
        ]}
      >
        medium large
      </MediaQuery>
    )
    expect(screen.queryByText('medium large')).toBeTruthy()
  })

  it('should handle media query changes', () => {
    matchMedia.useMediaQuery(
      'not screen and (min-width: 0) and (max-width: 72em)'
    )

    const Playground = () => {
      const [query, updateQuery] = React.useState({
        screen: true,
        not: true,
        min: '0',
        max: 'large',
      })

      return (
        <>
          <button
            onClick={() => {
              updateQuery({
                ...query,
                screen: !query.screen,
              })
            }}
          >
            Change
          </button>
          <span id="result">
            <MediaQuery matchOnSSR when={query}>
              when
            </MediaQuery>
            <MediaQuery not when={query}>
              not when
            </MediaQuery>
          </span>
        </>
      )
    }

    render(<Playground />)
    expect(screen.queryByText('when')).toBeTruthy()

    act(() => {
      screen.getByRole('button').click()
    })
    expect(screen.queryByText('not when')).toBeTruthy()
    act(() => {
      screen.getByRole('button').click()
    })
    expect(screen.queryByText('when')).toBeTruthy()
  })
})
