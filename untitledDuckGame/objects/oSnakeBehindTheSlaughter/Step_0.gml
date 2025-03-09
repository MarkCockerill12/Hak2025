// AI Movement Logic

// Check if we're on a platform (oGrass)
var on_platform = place_meeting(x, y+1, oGrass);
var idle_wait_timer;
var idle_timer;
var idle_dir;

// Just Run
if justrun == true {
    // Only move horizontally by adjusting x directly
    var dir = sign(oDuck.x - x);  // -1 for left, 1 for right, 0 for same position
   
    
    // Set sprite direction based on movement
    if (dir != 0) image_xscale = dir * -1;
} else {
    // Initial Proximity Trigger for Chase
    if runaway == false && chase == false && distance_to_object(oDuck) < 200 {
        chase = true;
        runaway = false;
    }

    // New Proximity Trigger for Chase (Only one for life of instance)
    if chase == true && runaway == false && distance_to_object(oDuck) < 400 {
        // Only move horizontally by adjusting x directly
        var dir = sign(oDuck.x - x);  // -1 for left, 1 for right, 0 for same position
        
		x += dir;
        
        // Set sprite direction based on movement
        if (dir != 0) image_xscale = dir * -1;
    }

    // If Char is more than 200 pixels away, do idle movement
    if ((chase == true && runaway == false && distance_to_object(oDuck) > 200) || 
       (chase == false && runaway == false)) {
        // Idle movement logic
        if (!variable_instance_exists(id, "idle_timer")) {
            idle_timer = 0;
            idle_dir = choose(-1, 1);  // Random initial direction
            idle_wait_timer = 60;       // Add a wait timer to prevent immediate direction changes
        }
        
        // Only try to move if not waiting
        if (idle_wait_timer <= 0) {
            // Change direction occasionally
            idle_timer--;
            if (idle_timer <= 0) {
                //idle_timer = irandom_range(60, 180); // 1-3 seconds at 60 fps
                idle_dir = choose(-1, 1);  // New random direction
            }
            
            // Move slowly in the idle direction
            var move_speed = 1; // Slow movement speed
            var new_x = x + (idle_dir * move_speed);
            
            // IMPROVED PLATFORM EDGE DETECTION
            // Check if moving would cause us to walk off the platform
            var would_fall_off = false;
            if (on_platform) {
                would_fall_off = !place_meeting(new_x, y+1, oGrass);
            }
            
            // Check if we're hitting a side wall
            var hitting_wall = place_meeting(new_x, y, oGrass);
            
            // Check if we can move there without hitting anything
            if (!hitting_wall && 
                !place_meeting(new_x, y, oSpikes) && 
                !place_meeting(new_x, y, oDuck) && 
                !place_meeting(new_x, y, oSnakeBehindTheSlaughter) && 
                !would_fall_off) {
                
                x = new_x;
                // Set sprite direction based on movement
                //image_xscale = idle_dir * -1;
            } else {
                // Hit something or would fall off, wait a bit before trying to move again
                idle_dir *= -1;
                idle_wait_timer = 60; // Wait half a second before trying to move again
                
                // Set sprite direction based on new direction
                //image_xscale = idle_dir * -1;
            }
        } else {
            // Still waiting, decrease timer
            idle_wait_timer--;
        }
    }
}

// Apply gravity if not on a platform
if (!on_platform) {
    // Simple gravity - fall until we hit a platform
    var gravity_speed = 4;
    if (!place_meeting(x, y + gravity_speed, oGrass)) {
        y += gravity_speed;
    } else {
        // Move exactly to contact position
        while (!place_meeting(x, y + 1, oGrass) && !place_meeting(x, y, oGrass)) {
            y += 1;
        }
    }
} 

// Stop and Start Animation
if x == xprevious {  // Check if x position has changed
    image_speed = 0;
} else {
    image_speed = 2;
}