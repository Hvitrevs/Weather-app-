export const ICON_MAP_NIGHT = new Map();


addMapping([0,1], "moon")
addMapping([2], "cloud-moon")
addMapping([3], "cloud1")
addMapping([45,48], "smog1")
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, ], "cloud-showers-heavy1")
addMapping([71, 73, 75, 77, 85, 86], "night-snow")
addMapping([95, 96, 99], "cloud-bolt1")

function addMapping(values, icon){
    values.forEach(value => {
        ICON_MAP_NIGHT.set(value, icon)
    })
}