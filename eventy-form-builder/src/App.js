// src/App.js
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

/* =======================
   Styled Components
======================= */
const Container = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 2rem;
  font-family: sans-serif;
`;

const Header = styled.div`
  background: #673ab7; /* Purple header */
  color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const TitleInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  outline: none;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  margin-top: 0.5rem;
  outline: none;
  resize: none;
`;

const SectionContainer = styled.div`
  background: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SectionTitleInput = styled.input`
  width: 100%;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  outline: none;
  background: #f7f7f7;
`;

const QuestionContainer = styled.div`
  background: #fff;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const QuestionLabelInput = styled.input`
  width: 100%;
  border: none;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  outline: none;
  background: #fff;
`;

const TypeSelect = styled.select`
  margin-right: 0.5rem;
`;

const Button = styled.button`
  background: #673ab7;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #5e35b1;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e0e0e0;
  color: #333;
  &:hover {
    background: #ccc;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 1.25rem;
  margin-left: 0.5rem;
`;

function App() {
  // Form Title & Description
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form Description");

  // Sections Array
  const [sections, setSections] = useState([
    {
      id: uuidv4(),
      title: "Untitled Section",
      questions: [
        {
          id: uuidv4(),
          label: "Untitled Question",
          type: "text",
          required: false,
          options: [""], // For multipleChoice, checkbox, dropdown, etc.
        },
      ],
    },
  ]);

  /* =======================
       Drag & Drop Logic
  ======================= */
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Same section: reorder questions
    if (source.droppableId === destination.droppableId) {
      const sectionIndex = sections.findIndex(
        (sec) => sec.id === source.droppableId
      );
      if (sectionIndex < 0) return;
      const newSections = [...sections];
      const currentSection = newSections[sectionIndex];

      const [removed] = currentSection.questions.splice(source.index, 1);
      currentSection.questions.splice(destination.index, 0, removed);
      setSections(newSections);
    } else {
      // Different sections: move question
      const sourceSectionIndex = sections.findIndex(
        (sec) => sec.id === source.droppableId
      );
      const destSectionIndex = sections.findIndex(
        (sec) => sec.id === destination.droppableId
      );
      if (sourceSectionIndex < 0 || destSectionIndex < 0) return;
      const newSections = [...sections];

      const [removed] = newSections[sourceSectionIndex].questions.splice(
        source.index,
        1
      );
      newSections[destSectionIndex].questions.splice(
        destination.index,
        0,
        removed
      );
      setSections(newSections);
    }
  };

  /* =======================
         Section CRUD
  ======================= */
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: uuidv4(),
        title: "Untitled Section",
        questions: [],
      },
    ]);
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter((sec) => sec.id !== sectionId));
  };

  const updateSection = (sectionId, key, value) => {
    setSections(
      sections.map((sec) =>
        sec.id === sectionId ? { ...sec, [key]: value } : sec
      )
    );
  };

  /* =======================
        Question CRUD
  ======================= */
  const addQuestion = (sectionId) => {
    setSections(
      sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: [
                ...sec.questions,
                {
                  id: uuidv4(),
                  label: "Untitled Question",
                  type: "text",
                  required: false,
                  options: [""],
                },
              ],
            }
          : sec
      )
    );
  };

  const removeQuestion = (sectionId, questionId) => {
    setSections(
      sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: sec.questions.filter((q) => q.id !== questionId),
            }
          : sec
      )
    );
  };

  const updateQuestion = (sectionId, questionId, key, value) => {
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) =>
              q.id === questionId ? { ...q, [key]: value } : q
            ),
          };
        }
        return sec;
      })
    );
  };

  /* =======================
       Options CRUD
  ======================= */
  const addOption = (sectionId, questionId) => {
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === questionId) {
                return { ...q, options: [...q.options, ""] };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  const updateOption = (sectionId, questionId, index, value) => {
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[index] = value;
                return { ...q, options: newOptions };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  const removeOption = (sectionId, questionId, index) => {
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions.splice(index, 1);
                return { ...q, options: newOptions };
              }
              return q;
            }),
          };
        }
        return sec;
      })
    );
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <DescriptionInput
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Header>

      {/* Add Section Button */}
      <Button onClick={addSection}>Add Section</Button>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        {sections.map((section) => (
          <SectionContainer key={section.id}>
            {/* Section Title */}
            <SectionTitleInput
              value={section.title}
              onChange={(e) => updateSection(section.id, "title", e.target.value)}
            />
            <IconButton onClick={() => removeSection(section.id)}>🗑</IconButton>

            {/* Add Question */}
            <Button onClick={() => addQuestion(section.id)}>Add Question</Button>

            {/* Droppable area for questions */}
            <Droppable droppableId={section.id}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {section.questions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <QuestionContainer
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* Question Label */}
                          <QuestionLabelInput
                            value={question.label}
                            onChange={(e) =>
                              updateQuestion(section.id, question.id, "label", e.target.value)
                            }
                          />
                          <div style={{ marginBottom: "0.5rem" }}>
                            {/* Question Type */}
                            <TypeSelect
                              value={question.type}
                              onChange={(e) =>
                                updateQuestion(section.id, question.id, "type", e.target.value)
                              }
                            >
                              <option value="text">Short Answer</option>
                              <option value="paragraph">Paragraph</option>
                              <option value="multipleChoice">Multiple Choice</option>
                              <option value="checkbox">Checkboxes</option>
                              <option value="dropdown">Dropdown</option>
                              <option value="date">Date</option>
                              <option value="time">Time</option>
                            </TypeSelect>

                            {/* Required Toggle */}
                            <label style={{ marginRight: "0.5rem" }}>
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) =>
                                  updateQuestion(section.id, question.id, "required", e.target.checked)
                                }
                              />
                              Required
                            </label>

                            {/* Remove Question Button */}
                            <IconButton onClick={() => removeQuestion(section.id, question.id)}>
                              🗑
                            </IconButton>
                          </div>

                          {/* If the question type uses options */}
                          {(question.type === "multipleChoice" ||
                            question.type === "checkbox" ||
                            question.type === "dropdown") && (
                            <div>
                              {question.options.map((opt, idx) => (
                                <div
                                  key={idx}
                                  style={{ display: "flex", marginBottom: "0.25rem" }}
                                >
                                  <input
                                    style={{ flex: 1 }}
                                    value={opt}
                                    onChange={(e) =>
                                      updateOption(section.id, question.id, idx, e.target.value)
                                    }
                                  />
                                  <IconButton
                                    onClick={() => removeOption(section.id, question.id, idx)}
                                  >
                                    🗑
                                  </IconButton>
                                </div>
                              ))}
                              <SecondaryButton
                                onClick={() => addOption(section.id, question.id)}
                              >
                                Add Option
                              </SecondaryButton>
                            </div>
                          )}
                        </QuestionContainer>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </SectionContainer>
        ))}
      </DragDropContext>
    </Container>
  );
}

export default App;
