import { useState } from "react";
import { createEvent } from "../server/db/insert";
import { type Event } from "../server/db/schema";
import { Button, Input, Label, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./ui/modal";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [eventData, setEventData] = useState<Partial<Event>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createEvent(eventData as Event);
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Create New Event</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" name="name" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="gardening">Gardening</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="datetime-local" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="datetime-local" onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="volunteerLimit">Volunteer Limit</Label>
            <Input id="volunteerLimit" name="volunteerLimit" type="number" onChange={handleChange} />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Event</Button>
      </ModalFooter>
    </Modal>
  );
}
