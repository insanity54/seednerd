# seednerd

## Dependencies

X11. (Not wayland.) Forget about running on Wayland. This program is meant to run 24/7 fullscreen, start/stop several programs and Wayland Pipewire(?) security *will* intrrupt that. MX Linux tested and recommended. Single monitor, 1920x1080. An old laptop is perfect for this.

All these binaries must be on the $PATH

* node
* pnpm
* xdotool
* dotenvx
* aplay
* luanti
* scrot


## issues

* [x] crafting
* [ ] scooter can get stuck on a vehicle and there's no way to get off
* [ ] `!help <command>` doesn't give any response
* [ ] twitch chat doesn't let chatters post similar messages
* [ ] `!look right` should `!turn right`
* [ ] Players want to batch commands. e.g. `!enter !home`
* [ ] `/anchors`
* [ ] invisible exploit-- get on Vespa, warp to spawn, warp home, get killed while on scooter.
* [ ] aliases for commands: respawn|spawn
* [ ] scooter sometimes misstypes things. example: `!spawn` typed `/spwn`. IDK what the problem is here. Maybe it's running two tasks at once?
* [x] `!camera` for changing camera
* [x] ANY chat message resets the idle timer
* [x] `!punch` cannot chop a tree, it is not held long enough
* [x] `!walk forward <number>` number doesn't have any effect
* [x] It's almost impossible to zero in on a Node we want to interact with (turn/look granularity too high)
* [x] idle timeout is too low
* [x] idle commands are interruptive -- bot teleports character back to spawn when chatter is trying to go somewhere
* [x] `!server` command is missing
* [x] Server info not displayed on rotation