import { DestinationForm } from "@/components/DestinationForm";

export default function NewDestination() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-playfair">Add New Destination</h1>
        <p className="text-zinc-500 mt-2">Fill in the details to showcase a new spot in Sierra Leone.</p>
      </div>
      
      <DestinationForm />
    </div>
  );
}
