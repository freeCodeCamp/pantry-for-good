export const actions = {
  header: [
    {
      label: 'Add',
      icon: 'plus',
      style: 'success',
      onClick: 'save'
    }, {
      label: 'Reset',
      icon: 'times',
      style: 'warning',
      onClick: 'reset'
    }
  ],

  tableRow: [
    {
      label: 'Edit',
      icon: 'pencil',
      style: 'primary',
      onClick: 'showEdit'
    }, {
      label: 'Delete',
      icon: 'trash',
      style: 'danger',
      onClick: 'delete'
    }
  ],

  editRow: [
    {
      label: 'Save',
      icon: 'floppy-o',
      style: 'success',
      onClick: 'save'
    }, {
      label: 'Cancel',
      icon: 'times',
      style: 'warning',
      onClick: 'hideEdit'
    }
  ]
}

export const questionnaireTable = {
  title: 'Questionnaires',
  columns: [
    {
      name: 'name',
      label: 'Name',
      placeholder: 'Questionnaire Name',
      type: 'text'
    }, {
      name: 'identifier',
      label: 'Identifier',
      placeholder: 'Short Identifier',
      type: 'text'
    }, {
      name: 'description',
      label: 'Description',
      placeholder: 'Description',
      type: 'text'
    }
  ]
}

export const getSectionTable = (questionnaires = []) => ({
  title: 'Sections',
  columns: [
    {
      name: 'name',
      label: 'Name',
      placeholder: 'Section Name',
      type: 'text'
    }, {
      name: 'questionnaire',
      label: 'Questionnaire',
      type: 'select',
      options: [
        {label: '', value: 'Select a questionnaire'},
        ...questionnaires.map(questionnaire => ({
          label: questionnaire.name,
          value: questionnaire._id
        }))
      ]
    }, {
      name: 'position',
      label: 'Position',
      placeholder: 'Position',
      type: 'number'
    }
  ]
})

export const getFieldTable = (sections = []) => ({
  title: 'Fields',
  columns: [
    {
      name: 'label',
      label: 'Label',
      placeholder: 'Label',
      type: 'textarea'
    }, {
      name: 'name',
      label: 'Name',
      placeholder: 'Name',
      type: 'text'
    }, {
      name: 'section',
      label: 'Section',
      type: 'select',
      options: [
        {label: '', value: 'Select a section'},
        ...sections.map(section => ({
          label: section.name,
          value: section._id
        }))
      ]
    }, {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: [
        {label: '', value: 'Select a type'},
        {label: 'Text', value: 'Text'},
        {label: 'Textarea', value: 'Textarea'},
        {label: 'Date', value: 'Date'},
        {label: 'Radio Buttons', value: 'Radio Buttons'},
        {label: 'Checkboxes', value: 'Checkboxes'},
        {label: 'Table', value: 'Table'},
      ]
    }, {
      name: 'choices',
      label: 'Choices',
      placeholder: 'Choices',
      type: 'text'
    }, {
      name: 'row',
      label: 'Row',
      placeholder: 'Row',
      type: 'number'
    }, {
      name: 'column',
      label: 'Column',
      placeholder: 'Column',
      type: 'number'
    }, {
      name: 'span',
      label: 'Span',
      placeholder: 'Span',
      type: 'number'
    }
  ]
})
