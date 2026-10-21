export default function decorate(block) {
  if (block.classList.contains('graduate')) {
    const image = block.querySelector('img');
    if (image) {
      image.loading = 'eager';
      image.fetchPriority = 'high';
    }
  }
}
