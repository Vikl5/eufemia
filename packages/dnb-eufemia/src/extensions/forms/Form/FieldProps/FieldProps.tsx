import React, { useContext, useRef } from 'react'
import DataContext, { ContextState } from '../../DataContext/Context'
import { Props as DataContextProps } from '../../DataContext/Provider'
import { UseFieldProps } from '../../types'
import { FormStatusProps } from '../../../../components/FormStatus'
import { assignPropsWithContext } from '../../../../shared/component-helper'
import FieldPropsContext from './FieldPropsContext'
import SharedProvider from '../../../../shared/Provider'
import { ContextProps } from '../../../../shared/Context'

export type FieldPropsProps = UseFieldProps & {
  children: React.ReactNode
  FormStatus?: { globalStatus: FormStatusProps }
  locale?: DataContextProps<unknown>['locale']
  translations?: DataContextProps<unknown>['translations']
}

export default function FieldProps(props: FieldPropsProps) {
  const { children, FormStatus, ...rest } = props

  const nestedContext = useContext(FieldPropsContext)
  const dataContextRef = useRef<ContextState>()
  dataContextRef.current = useContext<ContextState>(DataContext)

  const sharedProviderProps: ContextProps = {}

  // Extract props to be used in the shared global context
  const { disabled, locale, translations, ...restOfRest } = Object.assign(
    nestedContext?.inheritedContext || {},
    rest
  ) as ContextProps & {
    disabled?: boolean
  }
  if (typeof disabled === 'boolean') {
    sharedProviderProps.formElement = { disabled }
  }
  if (FormStatus) {
    sharedProviderProps.FormStatus = FormStatus
  }
  if (locale) {
    sharedProviderProps.locale = locale
  }
  if (translations) {
    sharedProviderProps.translations = {}
    const trObj = translations as Record<
      ContextProps['locale'],
      Record<string, Record<string, string>>
    >

    for (const locale in trObj) {
      const newObj: Record<
        'Forms',
        Record<string, Record<string, string>>
      > = {
        Forms: {},
      }

      for (const key in trObj[locale]) {
        const newKeyObj: Record<string, string> = {}

        for (const subKey in trObj[locale][key]) {
          newKeyObj[subKey] = trObj[locale][key][subKey]
        }

        newObj.Forms[key] = newKeyObj
      }

      sharedProviderProps.translations[locale] = newObj
    }
  }

  function extend<T>(fieldProps: T) {
    // Extract props from data context to be used in fields
    const { required } = dataContextRef.current

    return nestedContext.extend(
      assignPropsWithContext(fieldProps, { required }, restOfRest)
    ) as T
  }

  return (
    <FieldPropsContext.Provider value={{ extend, inheritedContext: rest }}>
      <SharedProvider {...sharedProviderProps}>{children}</SharedProvider>
    </FieldPropsContext.Provider>
  )
}