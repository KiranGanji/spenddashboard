declare module 'react-simple-maps' {
  import { ComponentType } from 'react'

  export const ComposableMap: ComponentType<{
    projection?: string
    width?: number
    height?: number
    children?: React.ReactNode
  }>

  export const Geographies: ComponentType<{
    geography: any
    children: (props: { geographies: any[] }) => React.ReactNode
  }>

  export const Geography: ComponentType<{
    geography: any
    onMouseEnter?: (evt: React.MouseEvent<SVGPathElement, MouseEvent>) => void
    onMouseLeave?: (evt: React.MouseEvent<SVGPathElement, MouseEvent>) => void
    onClick?: () => void
    style?: any
  }>
}

declare module 'topojson-client' {
  export function feature(topology: any, object: any): any
}
