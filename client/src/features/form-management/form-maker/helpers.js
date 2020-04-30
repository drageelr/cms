const sampleClientForm = { // Sample form currently
  id: 0,
  isPublic: false,
  title: "Test Form",
  creatorId: 1,
  sectionsOrder: [1, 2], //ordered list of section Ids (any Ids are not unique to any other forms)
  sections: {
    1:"Section A", 
    2:"Section B"
  },
  componentsOrder: {
    1: [1, 2], // sectionId:  list of component Ids in order
    2: [1] 
  },
  components: {
    1:"Component A", //componentId: componentTitle
    2:"Component B"
  },
  itemsOrder: { 
    1: [1, 2], //componentId: ordered list of itemIds
    2: [3],
  },
  items: { //itemId: itemData
    1:{
      type: "textlabel",
      label: "Item 1",
      required: true,
      defaultVisibility: true
    },
    2:{
      type: "textlabel",
      label: "Item 2",
      required: true,
      defaultVisibility: true
    },
    3:{
      type: "textlabel",
      label: "Item 3",
      required: true,
      defaultVisibility: true
    }
  },
  checklistItems: [{sectionId: 1, description: "Verify Email"}, {sectionId: 2, description: "Check Society"}]
}

const sampleServerForm = {
  title: "Test Form",
  isPublic: false,
  sections: [
    {
      sectionId: 1,
      title: "Section A",
      componentsOrder: [1, 2]
    },
    {
      sectionId: 2,
      title: "Section B",
      componentsOrder: []
    }
  ],
  components: [
    {
      componentId: 1,
      title: "Component A",
      itemsOrder: [1, 2]
    },
    {
      componentId: 2,
      title: "Component B",
      itemsOrder: [3]
    }
  ],
  items: [
    {
      itemId: 1,
      type: "textlabel",
      label: "Item 1",
      required: true,
      defaultVisibility: true
    },
    {
      itemId: 2,
      type: "textlabel",
      label: "Item 2",
      required: true,
      defaultVisibility: true
    },
    {
      itemId: 3,
      type: "textlabel",
      label: "Item 3",
      required: true,
      defaultVisibility: true
    }
  ],
  checklistItems: [{sectionId: 1, description: "Verify Email"}, {sectionId: 2, description: "Check Society"}]
}

function convertToServerForm(clientForm) {
  // for use in Create/Edit Form before sending the template
  // creating the uniquely defined objects that the server form template requires
  let sections = [], components = [], items = [], convertedForm = {}
  // const {id, title, creatorId, isPublic, sections, components, items,
  //   sectionsOrder, componentsOrder, itemsOrder } = clientForm

  // sections creation
  
  // components creation
  
  // items creation

  console.log(convertedForm)
}

function convertToClientForm(serverForm) {
  // for use in Fetch Form to convert the form before pushing it to state
  // creating the uniquely defined objects that the client form template requires
  let sectionsOrder = [], componentsOrder = {}, itemsOrder = {}, sections = [], components = [], items = []

  // const {title, isPublic, sections, components, items } = serverForm

  // sections, sectionsOrder, componentsOrder creation
  serverForm.sections.forEach(section=>{
    const sectionId = Number(section.sectionId)
    sectionsOrder.push(section.sectionId)
    componentsOrder[section.sectionId] = section.componentsOrder
    sections[section.sectionId] = section.title
  })

  // components creation
  serverForm.components.forEach(component=>{
    itemsOrder[component.componentId] = component.itemsOrder
    components[component.componentId] = component.title
  })

  // items, itemsOrder creation
  serverForm.items.forEach(item=>{
    items[item.itemId] = {...item}
    delete items[item.itemId]["itemId"]
  })

  // everything else will be directly copied
  return {
    isPublic: serverForm.isPublic,
    title: serverForm.title,
    checklistItems: serverForm.checklistItems,
    sectionsOrder,
    componentsOrder,
    itemsOrder,
    sections,
    components,
    items
  } //converted form
}

const convertedForm = convertToClientForm(sampleServerForm)
console.log(convertedForm)