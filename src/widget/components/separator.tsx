type props = {
    height?: number;
}
export function Separator({ height = 15 }: props) {
    return <box css={`min-height: ${height}px;`} />
}
