export const ICON_MAP1 = new Map()

addMapping([0,1], "sun1")
addMapping([2],"cloud-sun1")
addMapping([3],"cloud1")
addMapping([45,48], "smog1")
addMapping(
    [51, 53, 55, 56, 57, 61, 63, 66, 67, 80, 81, 82], "cloud-showers-heavy1",
)
addMapping([71, 73, 75, 77, 85, 86], "snowflake1")
addMapping([95, 96, 99], "cloud-bolt1")


function addMapping(values, icon) {
    values.forEach(value => {
        ICON_MAP1.set(value, icon)
    })
}