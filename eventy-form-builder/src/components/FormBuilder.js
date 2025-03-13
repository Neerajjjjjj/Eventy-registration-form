import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import Card from "./Card";
import CardContent from "./CardContent";

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState("Untitled Form");

  const addField = (type) => {
    setFields([...fields, { id: uuidv4(), type, label: "", required: false }]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <Input
        className="text-xl font-bold mb-4 border p-2 w-full"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />

      {fields.map(field => (
        <Card key={field.id} className="mb-4">
          <CardContent>
            <Input
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => updateField(field.id, "label", e.target.value)}
            />
            <Select
              value={field.type}
              onChange={(e) => updateField(field.id, "type", e.target.value)}
            >
              <option value="text">Short Answer</option>
              <option value="textarea">Paragraph</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Multiple Choice</option>
              <option value="dropdown">Dropdown</option>
            </Select>
            <Button variant="destructive" onClick={() => removeField(field.id)}>Remove</Button>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap gap-2 mt-4">
        <Button onClick={() => addField("text")}>Add Short Answer</Button>
        <Button onClick={() => addField("textarea")}>Add Paragraph</Button>
        <Button onClick={() => addField("checkbox")}>Add Checkbox</Button>
        <Button onClick={() => addField("radio")}>Add Multiple Choice</Button>
        <Button onClick={() => addField("dropdown")}>Add Dropdown</Button>
      </div>
    </div>
  );
};

export default FormBuilder;
