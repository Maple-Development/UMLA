<script>
    let title="UMLA";
    import NavBar from "../components/nav-bar.svelte";
    import ControlBar from "../components/control-bar.svelte";
    import "./css/app.css";
</script>
<head>
  <title>{title}</title>
</head>

<NavBar />
<slot></slot>
<ControlBar />

