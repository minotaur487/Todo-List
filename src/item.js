export default function Item(title, dueDate, priority) {
  const props = {
    title,
    description: '',
    dueDate,
    priority    // implement a priority queue to sort this
  }

  return props;
}
