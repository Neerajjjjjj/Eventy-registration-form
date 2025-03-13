import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styled, { ThemeProvider } from "styled-components";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/* =======================================
   1. Styled Components + Theming
======================================= */
const AppContainer = styled.div`
  margin: 0 auto;
  max-width: 900px;
  padding: 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: ${(props) =>
    props.active ? props.theme.primary : "#e0e0e0"};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  border-radius: 4px;
  cursor: pointer;
`;

const Header = styled.div`
  background: ${(props) => props.theme.primary};
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

const Button = styled.button`
  background: ${(props) => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
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

const TypeSelect = styled.select`
  margin-right: 0.5rem;
`;

const SecondaryButton = styled(Button)`
  background: #e0e0e0;
  color: #333;
  &:hover {
    background: #ccc;
  }
`;

const ColorPicker = styled.input`
  margin: 0 0.5rem;
  padding: 0;
`;

/* =======================================
   2. Main Component
======================================= */
function App() {
  // 2.1: Theme color state
  const [themeColor, setThemeColor] = useState("#673ab7");

  // 2.2: Tabs: "edit" | "preview" | "responses"
  const [activeTab, setActiveTab] = useState("edit");

  // 2.3: Form Title & Description
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form Description");

  // 2.4: Sections + Questions
  const [sections, setSections] = useState([
    {
      id: uuidv4(),
      title: "Untitled Section",
      questions: [
        {
          id: uuidv4(),
          label: "Untitled Question",
          type: "text", // text, paragraph, multipleChoice, checkbox, dropdown, date, time
          required: false,
          options: [""], // for multipleChoice/checkbox/dropdown
        },
      ],
    },
  ]);

  // 2.5: Responses
  const [responses, setResponses] = useState([]);

  /* =======================================
      3. Drag & Drop (Edit Mode Only)
  ======================================== */
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

  /* =======================================
      4. Section CRUD
  ======================================== */
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

  /* =======================================
      5. Question CRUD
  ======================================== */
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

  /* =======================================
      6. Options CRUD
  ======================================== */
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

  /* =======================================
      7. Preview & Responses
  ======================================== */
  // In "Preview" mode, we let the user fill out the form
  const [previewAnswers, setPreviewAnswers] = useState({}); 
  // e.g. { [questionId]: userAnswer }

  const handlePreviewChange = (questionId, value) => {
    setPreviewAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitForm = () => {
    // Collect the user's answers and store them as one "response"
    setResponses([...responses, previewAnswers]);
    // Clear the local preview answers
    setPreviewAnswers({});
    alert("Form submitted!");
  };

  return (
    <ThemeProvider theme={{ primary: themeColor }}>
      <AppContainer>
        {/* ========== Color/Theming ========== */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Pick Theme Color: </label>
          <ColorPicker
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
          />
        </div>

        {/* ========== Tabs ========== */}
        <Tabs>
          <TabButton
            active={activeTab === "edit"}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </TabButton>
          <TabButton
            active={activeTab === "preview"}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </TabButton>
          <TabButton
            active={activeTab === "responses"}
            onClick={() => setActiveTab("responses")}
          >
            Responses
          </TabButton>
        </Tabs>

        {/* ========== Header ========== */}
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

        {/* ========== EDIT MODE ========== */}
        {activeTab === "edit" && (
          <>
            <Button onClick={addSection}>Add Section</Button>
            <DragDropContext onDragEnd={onDragEnd}>
              {sections.map((section) => (
                <SectionContainer key={section.id}>
                  {/* Section Title */}
                  <SectionTitleInput
                    value={section.title}
                    onChange={(e) =>
                      updateSection(section.id, "title", e.target.value)
                    }
                  />
                  <IconButton onClick={() => removeSection(section.id)}>
                    🗑
                  </IconButton>
                  <Button onClick={() => addQuestion(section.id)}>
                    Add Question
                  </Button>

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
                                    updateQuestion(
                                      section.id,
                                      question.id,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />

                                {/* Question Settings */}
                                <div style={{ marginBottom: "0.5rem" }}>
                                  {/* Type */}
                                  <TypeSelect
                                    value={question.type}
                                    onChange={(e) =>
                                      updateQuestion(
                                        section.id,
                                        question.id,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="text">Short Answer</option>
                                    <option value="paragraph">Paragraph</option>
                                    <option value="multipleChoice">
                                      Multiple Choice
                                    </option>
                                    <option value="checkbox">Checkboxes</option>
                                    <option value="dropdown">Dropdown</option>
                                    <option value="date">Date</option>
                                    <option value="time">Time</option>
                                  </TypeSelect>

                                  {/* Required */}
                                  <label style={{ marginRight: "0.5rem" }}>
                                    <input
                                      type="checkbox"
                                      checked={question.required}
                                      onChange={(e) =>
                                        updateQuestion(
                                          section.id,
                                          question.id,
                                          "required",
                                          e.target.checked
                                        )
                                      }
                                    />
                                    Required
                                  </label>

                                  {/* Remove Question */}
                                  <IconButton
                                    onClick={() =>
                                      removeQuestion(section.id, question.id)
                                    }
                                  >
                                    🗑
                                  </IconButton>
                                </div>

                                {/* Options (if multipleChoice, checkbox, dropdown) */}
                                {(question.type === "multipleChoice" ||
                                  question.type === "checkbox" ||
                                  question.type === "dropdown") && (
                                  <div>
                                    {question.options.map((opt, idx) => (
                                      <div
                                        key={idx}
                                        style={{
                                          display: "flex",
                                          marginBottom: "0.25rem",
                                        }}
                                      >
                                        <input
                                          style={{ flex: 1 }}
                                          value={opt}
                                          onChange={(e) =>
                                            updateOption(
                                              section.id,
                                              question.id,
                                              idx,
                                              e.target.value
                                            )
                                          }
                                        />
                                        <IconButton
                                          onClick={() =>
                                            removeOption(
                                              section.id,
                                              question.id,
                                              idx
                                            )
                                          }
                                        >
                                          🗑
                                        </IconButton>
                                      </div>
                                    ))}
                                    <SecondaryButton
                                      onClick={() =>
                                        addOption(section.id, question.id)
                                      }
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
          </>
        )}

        {/* ========== PREVIEW MODE ========== */}
        {activeTab === "preview" && (
          <>
            {sections.map((section) => (
              <SectionContainer key={section.id}>
                <h3 style={{ marginBottom: "1rem" }}>{section.title}</h3>
                {section.questions.map((question) => (
                  <QuestionContainer key={question.id}>
                    <p style={{ fontWeight: "bold" }}>
                      {question.label}
                      {question.required && " *"}
                    </p>

                    {/* Render input based on question.type */}
                    {question.type === "text" && (
                      <input
                        style={{ width: "100%", padding: "0.5rem" }}
                        value={previewAnswers[question.id] || ""}
                        onChange={(e) =>
                          handlePreviewChange(question.id, e.target.value)
                        }
                      />
                    )}

                    {question.type === "paragraph" && (
                      <textarea
                        style={{ width: "100%", padding: "0.5rem" }}
                        rows={4}
                        value={previewAnswers[question.id] || ""}
                        onChange={(e) =>
                          handlePreviewChange(question.id, e.target.value)
                        }
                      />
                    )}

                    {(question.type === "multipleChoice" ||
                      question.type === "checkbox") && (
                      <>
                        {question.options.map((opt, idx) => {
                          const fieldName = `${question.id}-${idx}`;
                          if (question.type === "multipleChoice") {
                            return (
                              <div key={fieldName}>
                                <label>
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={opt}
                                    checked={
                                      previewAnswers[question.id] === opt
                                    }
                                    onChange={(e) =>
                                      handlePreviewChange(question.id, e.target.value)
                                    }
                                  />
                                  {" " + opt}
                                </label>
                              </div>
                            );
                          } else {
                            // checkbox
                            // For checkboxes, we store an array of selected values
                            const currentVal = previewAnswers[question.id] || [];
                            const checked = currentVal.includes(opt);

                            const handleCheckboxChange = (checkedValue) => {
                              if (checked) {
                                // remove from array
                                const newArr = currentVal.filter(
                                  (item) => item !== checkedValue
                                );
                                handlePreviewChange(question.id, newArr);
                              } else {
                                // add to array
                                handlePreviewChange(question.id, [
                                  ...currentVal,
                                  checkedValue,
                                ]);
                              }
                            };

                            return (
                              <div key={fieldName}>
                                <label>
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    checked={checked}
                                    onChange={() => handleCheckboxChange(opt)}
                                  />
                                  {" " + opt}
                                </label>
                              </div>
                            );
                          }
                        })}
                      </>
                    )}

                    {question.type === "dropdown" && (
                      <select
                        style={{ width: "100%", padding: "0.5rem" }}
                        value={previewAnswers[question.id] || ""}
                        onChange={(e) =>
                          handlePreviewChange(question.id, e.target.value)
                        }
                      >
                        <option value="">Select an option</option>
                        {question.options.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {question.type === "date" && (
                      <input
                        type="date"
                        style={{ width: "100%", padding: "0.5rem" }}
                        value={previewAnswers[question.id] || ""}
                        onChange={(e) =>
                          handlePreviewChange(question.id, e.target.value)
                        }
                      />
                    )}

                    {question.type === "time" && (
                      <input
                        type="time"
                        style={{ width: "100%", padding: "0.5rem" }}
                        value={previewAnswers[question.id] || ""}
                        onChange={(e) =>
                          handlePreviewChange(question.id, e.target.value)
                        }
                      />
                    )}
                  </QuestionContainer>
                ))}
              </SectionContainer>
            ))}
            <Button onClick={handleSubmitForm}>Submit</Button>
          </>
        )}

        {/* ========== RESPONSES TAB ========== */}
        {activeTab === "responses" && (
          <div>
            <h2>Responses</h2>
            {responses.length === 0 && <p>No responses yet.</p>}
            {responses.map((resp, index) => (
              <div
                key={index}
                style={{
                  background: "#f9f9f9",
                  padding: "1rem",
                  margin: "1rem 0",
                  borderRadius: "8px",
                }}
              >
                <h4>Response #{index + 1}</h4>
                {sections.map((section) =>
                  section.questions.map((question) => {
                    const ans = resp[question.id];
                    return (
                      <div key={question.id} style={{ marginBottom: "0.5rem" }}>
                        <strong>{question.label}: </strong>
                        {Array.isArray(ans) ? ans.join(", ") : ans || "(No answer)"}
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
