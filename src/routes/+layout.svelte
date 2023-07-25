<script>
    let title="UMLA";
    import NavBar from "../components/nav-bar.svelte";
    import ControlBar from "../components/control-bar.svelte";
    import "./css/app.css";
    import "./css/bottom-bar.css";
</script>
<head>
  <title>{title}</title>
</head>

<NavBar />
<slot></slot>
<br><br><br><br>
<ControlBar />
