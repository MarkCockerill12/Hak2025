// Inherit the parent event
event_inherited();

draw_set_font(fnt_help);


if (instance_exists(oControls))
{
	instance_destroy(oControls);
	instance_destroy(oControlsBackground);

}

else
{
	instance_create_layer(room_width - 400, room_height - 300, "Instances", oControls);
	instance_create_layer(room_width - 400, room_height - 300, "Instances", oControlsBackground);	
}