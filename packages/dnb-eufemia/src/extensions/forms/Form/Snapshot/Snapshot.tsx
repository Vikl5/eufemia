import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import SnapshotContext, {
  SnapshotContextState,
  SnapshotMap,
} from './SnapshotContext'
import DataContext from '../../DataContext/Context'

export type SnapshotId = string | number
export type SnapshotName = string

export type SnapshotProps = {
  name: SnapshotName
  children: React.ReactNode
}

function SnapshotProvider(props: SnapshotProps) {
  const { name, children } = props

  const [map] = useState(() => new Map())
  const mountedFieldsRef: SnapshotMap = useRef(map)
  const { snapshotsRef } = useContext(DataContext) || {}

  const setMountedField: SnapshotContextState['setMountedField'] =
    useCallback((path, state) => {
      mountedFieldsRef.current.set(path, state)
    }, [])

  useEffect(() => {
    if (snapshotsRef) {
      snapshotsRef.current.set(name, mountedFieldsRef.current)
    }
  }, [snapshotsRef, name])

  const contextValue = { name, setMountedField }

  return (
    <SnapshotContext.Provider value={contextValue}>
      {children}
    </SnapshotContext.Provider>
  )
}

SnapshotProvider._supportsSpacingProps = undefined

export default SnapshotProvider
