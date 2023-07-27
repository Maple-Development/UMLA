<script>
  import { browser } from '$app/environment';
  import { get, set } from 'idb-keyval';

  async function decideWhereToGo() {
    const fileHandleOrUndefined = await get('file');
    if (fileHandleOrUndefined) {
      window.location.href = '/library';
    } else {
      window.location.href = '/upload';
    }
  }

  if (browser) {
    decideWhereToGo();
  }
</script>
