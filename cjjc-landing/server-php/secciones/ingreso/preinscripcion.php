<!--
  ============================================================================
  FRAGMENTO: Inscripción FOBA Instrumento - Agosto 2026
  ----------------------------------------------------------------------------
  Pegar este bloque dentro de la <section> / <div> de la página.
  La página ya carga Bootstrap 5 (CSS y JS), por lo que NO se incluyen aquí.

  DEPENDENCIAS que deben estar presentes en el <head> de la página:
    - Bootstrap Icons (bi-*). Si no lo tenés cargado, agregá en el <head>:
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    - Fuentes Fraunces + Source Sans 3. Si no las cargás, agregá en el <head>:
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
      (Si no se cargan, cae a serif / sans-serif del sistema sin romper el diseño.)

  BOTONES: reemplazar los href="#" por el link del formulario online.
  ============================================================================
-->

<style>
  /* Estilos acotados a esta sección para no interferir con el resto del sitio */
  .cons-insc {
    --cons-ink: #1a1a1a;
    --cons-ink-soft: #4a4a4a;
    --cons-blue: #5b7fa6;
    --cons-blue-dark: #33506e;
    --cons-blue-tint: #eef3f8;
    --cons-line: #e2e2e2;
    --cons-white: #ffffff;
    font-family: 'Source Sans 3', system-ui, sans-serif;
    color: var(--cons-ink);
    background: var(--cons-white);
  }
  .cons-insc h1, .cons-insc h2, .cons-insc h3, .cons-insc .cons-serif {
    font-family: 'Fraunces', Georgia, serif;
  }

  /* HERO */
  .cons-insc .cons-hero {
    background: var(--cons-ink);
    color: #fff;
    padding: 3.5rem 1rem 3rem;
    position: relative;
    overflow: hidden;
    border-bottom: 3px solid var(--cons-blue);
  }
  .cons-insc .cons-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 44px);
    pointer-events: none;
  }
  .cons-insc .cons-hero .eyebrow {
    letter-spacing: .12em;
    font-size: .78rem;
    text-transform: uppercase;
    color: #a9bfd4;
    font-weight: 600;
  }
  .cons-insc .cons-hero h1 {
    font-size: clamp(2rem, 4.5vw, 3.1rem);
    font-weight: 600;
    line-height: 1.12;
  }
  .cons-insc .cons-hero p.lead { color: #d8d8d8; max-width: 46rem; }
  .cons-insc .cons-hero .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    background: rgba(91,127,166,.2);
    border: 1px solid var(--cons-blue);
    color: #cbdcec;
    border-radius: 2rem;
    padding: .35rem 1rem;
    font-size: .82rem;
    font-weight: 600;
  }

  /* CTA */
  .cons-insc .cons-btn {
    background: var(--cons-blue-dark);
    color: #fff;
    border: none;
    border-radius: .5rem;
    padding: .85rem 2rem;
    font-weight: 700;
    font-size: 1.02rem;
    display: inline-flex;
    align-items: center;
    gap: .6rem;
    transition: background .15s ease, transform .15s ease;
    text-decoration: none;
  }
  .cons-insc .cons-btn:hover { background: #26405a; transform: translateY(-2px); color: #fff; }
  .cons-insc .cons-btn:focus { box-shadow: 0 0 0 .25rem rgba(91,127,166,.35); outline: none; }

  /* Bloque destacado plazo/vacantes/horario */
  .cons-insc .cons-alert {
    background: var(--cons-blue-tint);
    border: 1px solid var(--cons-blue);
    border-radius: .6rem;
    padding: 1.1rem 1.3rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .cons-insc .cons-alert i { font-size: 1.7rem; color: var(--cons-blue-dark); flex: none; }
  .cons-insc .cons-alert .a-title { font-weight: 700; font-size: .96rem; margin-bottom: .1rem; }
  .cons-insc .cons-alert .a-sub { font-size: .87rem; color: var(--cons-ink-soft); margin-bottom: 0; }

  .cons-insc .cons-section-title {
    font-weight: 600;
    color: var(--cons-ink);
    display: flex;
    align-items: center;
    gap: .6rem;
    margin-bottom: 1rem;
  }
  .cons-insc .cons-section-title .num {
    font-family: 'Fraunces', serif;
    font-size: .95rem;
    color: var(--cons-blue-dark);
    border: 1px solid var(--cons-blue);
    border-radius: 50%;
    width: 2rem; height: 2rem;
    display: inline-flex; align-items: center; justify-content: center;
    flex: none;
  }

  /* Requisitos de documentación / tarjetas */
  .cons-insc .cons-req {
    background: #fff;
    border: 1px solid var(--cons-line);
    border-radius: .6rem;
    padding: 1.2rem 1.3rem;
    height: 100%;
    transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease;
  }
  .cons-insc .cons-req:hover { border-color: var(--cons-blue); box-shadow: 0 10px 24px -14px rgba(0,0,0,.2); transform: translateY(-3px); }
  .cons-insc .cons-req .r-num {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem;
    color: var(--cons-blue-dark);
    line-height: 1;
  }
  .cons-insc .cons-req .r-title { font-weight: 700; font-size: .98rem; margin: .5rem 0 .3rem; }
  .cons-insc .cons-req .r-desc { font-size: .88rem; color: var(--cons-ink-soft); margin-bottom: 0; }
  .cons-insc .cons-req .r-legend {
    display: block;
    margin-top: .5rem;
    background: var(--cons-blue-tint);
    border-left: 3px solid var(--cons-blue);
    padding: .45rem .7rem;
    font-size: .84rem;
    font-style: italic;
    color: var(--cons-blue-dark);
  }

  /* Listas con check */
  .cons-insc .cons-list-check { list-style: none; padding-left: 0; margin-bottom: 0; }
  .cons-insc .cons-list-check li {
    display: flex;
    align-items: flex-start;
    gap: .6rem;
    padding: .4rem 0;
    font-size: .95rem;
  }
  .cons-insc .cons-list-check li i { color: var(--cons-blue-dark); margin-top: .2rem; }

  .cons-insc .cons-note {
    background: #fff;
    border: 1px dashed var(--cons-blue);
    border-radius: .6rem;
    padding: .9rem 1.1rem;
    font-size: .88rem;
    color: var(--cons-ink-soft);
  }

  /* Banda CTA final */
  .cons-insc .cons-cta-band {
    background: var(--cons-ink);
    color: #fff;
    border-radius: .8rem;
    padding: 2rem 1.6rem;
    text-align: center;
    border-top: 3px solid var(--cons-blue);
  }
  .cons-insc .cons-cta-band h2 { font-weight: 600; }
  .cons-insc .cons-cta-band p { color: #cfcfcf; }
</style>

<div class="cons-insc">

  <!-- HERO -->
  <div class="cons-hero text-center text-md-start">
    <div class="container">
      <div class="eyebrow mb-2"><i class="bi bi-music-note-beamed me-1"></i> Conservatorio de Música "Juan José Castro"</div>
      <span class="hero-tag mb-3"><i class="bi bi-calendar-check"></i> Inicio de cursada: Agosto 2026</span>
      <h1>Inscripción abierta<br>Formación Básica de Instrumento</h1>
      <p class="lead mt-3">
        Se encuentra abierto el período de pre-inscripción para comenzar la Formación Básica (FO.BA.) de Instrumento
        a partir de agosto de 2026, destinado a personas mayores de 14 años.
      </p>
      <div class="mt-4">
        <!-- Reemplazar el href="#" por el link del formulario online -->
        <a href="#" class="cons-btn" target="_blank" rel="noopener">
          <i class="bi bi-pencil-square"></i> Iniciar Pre-inscripción
        </a>
      </div>
    </div>
  </div>

  <div class="container py-4 py-md-5">

    <!-- PLAZO Y VACANTES -->
    <div class="row g-3 mb-5">
      <div class="col-md-6">
        <div class="cons-alert">
          <i class="bi bi-clock-history"></i>
          <div>
            <p class="a-title">Plazo hasta el 20 de agosto</p>
            <p class="a-sub">Fecha límite para completar el formulario de pre-inscripción online.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="cons-alert">
          <i class="bi bi-people"></i>
          <div>
            <p class="a-title">Vacantes limitadas</p>
            <p class="a-sub">Los cupos son acotados; se asignan según disponibilidad de cada especialidad.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- A QUIÉN ESTÁ DIRIGIDO -->
    <div class="row mb-5">
      <div class="col-lg-7">
        <h2 class="cons-section-title"><span class="num">1</span>¿A quién está dirigido?</h2>
        <ul class="cons-list-check">
          <li><i class="bi bi-check-circle-fill"></i> <span>Personas <strong>mayores de 14 años</strong> que deseen iniciar sus estudios musicales.</span></li>
          <li><i class="bi bi-check-circle-fill"></i> <span>Quienes quieran cursar la <strong>Formación Básica (FO.BA.) de Instrumento</strong>.</span></li>
          <li><i class="bi bi-check-circle-fill"></i> <span>No se requieren conocimientos musicales previos ni hay examen de ingreso.</span></li>
        </ul>
        <div class="cons-note mt-3">
          <i class="bi bi-exclamation-circle me-1"></i>
          Esta inscripción <strong>no incluye la especialidad Canto</strong>; corresponde únicamente a la Formación Básica de Instrumento.
        </div>
      </div>
      <div class="col-lg-5 mt-4 mt-lg-0">
        <div class="cons-note h-100 d-flex flex-column justify-content-center">
          <div class="cons-serif fs-5 mb-2" style="color: var(--cons-blue-dark);">Sobre la FO.BA. de Instrumento</div>
          <p class="mb-0">
            Es el ciclo de iniciación musical previo al nivel terciario. Para mayores de 14 años tiene una duración
            de <strong>3 años</strong> y se cursa por materia: <strong>Lenguaje Musical</strong> (base de la
            lectoescritura musical) e <strong>Instrumento</strong> (práctica con el instrumento elegido).
          </p>
        </div>
      </div>
    </div>

    <!-- HORARIOS DE CURSADA -->
    <div class="row mb-5">
      <div class="col-12">
        <h2 class="cons-section-title"><span class="num">2</span>Horarios de cursada</h2>
        <div class="row g-3">
          <div class="col-md-6">
            <div class="cons-req h-100">
              <div class="r-title"><i class="bi bi-calendar2-week me-1" style="color:var(--cons-blue-dark);"></i> Lenguaje Musical</div>
              <p class="r-desc mb-2">Se dictará en una <strong>única comisión</strong>, en el siguiente horario fijo:</p>
              <div class="cons-alert mt-2" style="padding:.8rem 1rem;">
                <i class="bi bi-clock" style="font-size:1.4rem;"></i>
                <div>
                  <p class="a-title mb-0">Lunes y miércoles</p>
                  <p class="a-sub">de 17.30 a 19.30 h</p>
                </div>
              </div>
              <p class="r-desc mt-3 mb-0">
                <i class="bi bi-exclamation-circle me-1" style="color:var(--cons-blue-dark);"></i>
                Al haber una sola comisión, es indispensable disponer de esa franja horaria para poder cursar.
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="cons-req h-100">
              <div class="r-title"><i class="bi bi-music-note-list me-1" style="color:var(--cons-blue-dark);"></i> Instrumento</div>
              <p class="r-desc mb-2">La cursada es <strong>más flexible</strong>.</p>
              <p class="r-desc mb-0">
                El día y horario dependen del <strong>instrumento elegido</strong> y de la
                <strong>disponibilidad de vacantes</strong> de cada uno. Se coordina al momento de la inscripción.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DOCUMENTACIÓN -->
    <div class="row mb-5">
      <div class="col-12">
        <h2 class="cons-section-title"><span class="num">3</span>Documentación requerida</h2>
        <p class="mb-4">Al completar la pre-inscripción deberás presentar la siguiente documentación:</p>
        <div class="row g-3">
          <div class="col-md-4">
            <div class="cons-req">
              <div class="r-num">01</div>
              <div class="r-title"><i class="bi bi-card-text me-1" style="color:var(--cons-blue-dark);"></i> Fotocopia de DNI</div>
              <p class="r-desc">Copia del Documento Nacional de Identidad del aspirante.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="cons-req">
              <div class="r-num">02</div>
              <div class="r-title"><i class="bi bi-mortarboard me-1" style="color:var(--cons-blue-dark);"></i> Estudios secundarios</div>
              <p class="r-desc">Certificado de estudiante regular <strong>o</strong> título secundario.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="cons-req">
              <div class="r-num">03</div>
              <div class="r-title"><i class="bi bi-heart-pulse me-1" style="color:var(--cons-blue-dark);"></i> Apto psico-físico</div>
              <p class="r-desc">Certificado médico que incluya la leyenda:</p>
              <span class="r-legend">"Apto para realizar estudios musicales de nivel terciario"</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA FINAL -->
    <div class="row">
      <div class="col-12">
        <div class="cons-cta-band">
          <h2 class="mb-2">Completá tu pre-inscripción online</h2>
          <p class="mb-4">Recordá que el plazo vence el <strong>20 de agosto</strong> y las vacantes son limitadas.</p>
          <!-- Reemplazar el href="#" por el link del formulario online -->
          <a href="#" class="cons-btn" target="_blank" rel="noopener">
            <i class="bi bi-pencil-square"></i> Iniciar Pre-inscripción
          </a>
        </div>
      </div>
    </div>

  </div>
</div>
<!-- ===== FIN FRAGMENTO ===== -->