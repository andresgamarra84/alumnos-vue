<div class='row'>
	<div class='col-12 text-center border-bottom mb-4'><h2>Formación Básica</h2></div>
	<div class='col-12 p-2'>Al comenzar los estudios en el Conservatorio, se ingresa al ciclo de iniciación a la música que llamamos FOBA (Formación Básica). Según la edad del ingresante, este primer ciclo tiene distinta duración, a saber:</div>
	<div class='row justify-content-around text-center fw-bold' id='menuFOBA'>
		<div class='col-6 col-md-3 mt-3 hover-effect' v-on:click="show(0)">Formación Básica para Niños y Adolescentes<br>(entre 9 y 13 años de edad)</div>
		<div class='col-6 col-md-3 mt-3 hover-effect' v-on:click="show(1)">Formación Básica para Jóvenes y Adultos<br>(mayores de 14 años)</div>
		<div class='col-6 col-md-3 mt-3 hover-effect mx-auto mx-md-0' v-on:click="show(2)">Formación Básica para Jóvenes y Adultos<br>(Canto Lírico)</div>
	</div>
	<div class='pt-3 mt-3'>
		<div id='fobaninios' style='display:none;padding-top'>
			<div class="row mb-3">
			<div class="col text-center">
			  <h3 class='text-center'>Formación Básica para Niños y Preadolescentes</h3>
			</div>
		  </div>

		  <div class="row mb-3">
			<div class="col">
			  <div></div>
			</div>
		  </div>

		  <div class="row mb-3">
			<div class="col fw-bold">
			  Total asignaturas: 19
			</div>
		  </div>

		  <div class="row mb-3">
			<div class="col fw-bold">
			  Duración:
			</div>
		  </div>

		  <div class="row mb-3">
			<div class="col">
			  <ul>
				<li>Ciclo Inicial: 3 años</li>
				<li>Ciclo Medio: 3 años</li>
			  </ul>
			</div>
		  </div>

		  <div class="row mb-3">
			<div class="col fw-bold">
			  Requisitos:
			</div>
		  </div>

		  <div class="row mb-3">
			<div class="col">
			  <ul>
				<li>9 años cumplidos a Julio del ciclo lectivo a cursar</li>
				<li>Estar escolarizado en Nivel Primario</li>
			  </ul>
			</div>
		  </div>
		  <div class="row mb-3">
			<div class="col">
			  Correlatividad/es*: Asignaturas (identificadas por nº de orden) que deben ser acreditadas al comienzo del Ciclo Lectivo correspondiente o en condiciones de compensar hasta Julio-Agosto por ser materias correlativas.
			</div>
		  </div>
		  <div class="row text-center">
			<div class="col-12">
			  <h3>Ciclo Inicial</h3>
			</div>
		  </div>
		  <div class='border text-center'>
			  <div class="row">
				<div class="col-12">
				  <h4>1er Año</h4>
				</div>
			  </div>
			  <div class="row p-2">
				<div class="col-1"><b>Nº</b></div>
				<div class="col-7"><b>Materia</b></div>
				<div class="col-3"><b>Correlatividad/es*</b></div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">1</div>
				<div class="col-7">Taller de Iniciación Musical I</div>
				<div class="col-3">----</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">2</div>
				<div class="col-7">Taller de Iniciación Instrumental I</div>
				<div class="col-3">----</div>
				<div class="col-1"></div>
			  </div>
		  </div>
		  <div class='border text-center'>
			  <div class="row p-2">
				<div class="col-12">
				  <h4>2do Año</h4>
				</div>
			  </div>
			  <div class="row">
				<div class="col-1">3</div>
				<div class="col-7">Taller de Iniciación Musical II</div>
				<div class="col-3">1</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">4</div>
				<div class="col-7">Taller de Iniciación Instrumental II</div>
				<div class="col-3">1, 2</div>
				<div class="col-1"></div>
			  </div>
		  </div>
		  <div class='border text-center'>
			  <div class="row p-2">
				<div class="col-12">
				  <h4>3er Año</h4>
				</div>
			  </div>
			  <div class="row">
				<div class="col-1">5</div>
				<div class="col-7">Taller de Iniciación Musical III</div>
				<div class="col-3">2, 3</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">6</div>
				<div class="col-7">Taller de Iniciación Instrumental III</div>
				<div class="col-3 text-center">3, 4</div>
				<div class="col-1"></div>
			  </div>
		  </div>
		  <div class="row text-center p-3 mt-4">
			<div class="col-12">
			  <h3>Ciclo Medio</h3>
			</div>
		  </div>
		  <div class='border text-center'>
			  <div class="row p-2">
				<div class="col-12">
				  <h4>1er Año</h4>
				</div>
			  </div>
			  <div class="row">
				<div class="col-1"><b>Nº</b></div>
				<div class="col-7"><b>Materia</b></div>
				<div class="col-3"><b>Correlatividad/es*</b></div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">7</div>
				<div class="col-7">Lenguaje Musical I</div>
				<div class="col-3">5, 4</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">8</div>
				<div class="col-7">Instrumento I</div>
				<div class="col-3">5, 6</div>
				<div class="col-1"></div>
			  </div>
			</div>
			<div class='border text-center'>
			  <div class="row p-2">
				<div class="col-12">
				  <h4>2do Año</h4>
				</div>
			  </div>
			  <div class="row">
				<div class="col-1">9</div>
				<div class="col-7">Lenguaje Musical II</div>
				<div class="col-3">6, 7</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">10</div>
				<div class="col-7">Instrumento II</div>
				<div class="col-3">7, 8</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">11</div>
				<div class="col-7">Práctica de Conjunto Vocal e Instrumental I</div>
				<div class="col-3">3, 4</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">12</div>
				<div class="col-7">Práctica Coral I</div>
				<div class="col-3">3</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">13</div>
				<div class="col-7">Apreciación Musical I</div>
				<div class="col-3">4, 5</div>
				<div class="col-1"></div>
			  </div>
			</div>
			<div class='border text-center'>
			  <div class="row p-2">
				<div class="col-12">
				  <h4>3er Año</h4>
				</div>
			  </div>
			  <div class="row">
				<div class="col-1">14</div>
				<div class="col-7">Lenguaje Musical III</div>
				<div class="col-3">9, 8</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">15</div>
				<div class="col-7">Instrumento III</div>
				<div class="col-3">9, 10</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">16</div>
				<div class="col-7">Práctica de Conjunto Vocal e Instrumental II</div>
				<div class="col-3">11, 6, 7</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">17</div>
				<div class="col-7">Práctica Coral II</div>
				<div class="col-3">12</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">18</div>
				<div class="col-7">Apreciación Musical II</div>
				<div class="col-3">13, 8, 7</div>
				<div class="col-1"></div>
			  </div>
			  <div class="row">
				<div class="col-1">19</div>
				<div class="col-7">Instrumento Armónico</div>
				<div class="col-3">7</div>
				<div class="col-1"></div>
			  </div>
			</div>
		</div>
		<div id='fobaadultos' style='display:none'>
		  <div class="row">
			<div class="col-12">
			  <h3 class='text-center'>Formación Básica para Jóvenes y Adultos</h3>
			</div>
		  </div>
		  <div class="row">
			<div class="col-12">
			  <p>Total asignaturas: 12</p>
			  <p>Duración: 3 años</p>
			  <p>Requisitos:</p>
			  <ul>
				<li>Edad mínima: 14 años (cumplidos a Julio del ciclo lectivo a cursar)</li>
				<li>Cursando o Estudios Secundarios terminados</li>
			  </ul>
			</div>
		  </div>
		  <div class="row">
			<div class="col-12">
			  Correlatividad/es*: Asignaturas (identificadas por número de orden) que deben ser acreditadas al comienzo del Ciclo Lectivo correspondiente o en condiciones de compensar hasta Julio-Agosto por ser materias correlativas.
			</div>
		  </div>
		  
		  <!-- 1er Año -->
		  <div class="row text-center">
			<div class="col-12">
			  <h4>1er Año</h4>
			</div>
		  </div>
		  <div class="row">
			<div class="col-1"><b>Nº</b></div>
			<div class="col-7"><b>Materia</b></div>
			<div class="col-4 text-center"><b>Correlatividad/es*</b></div>
		  </div>
		  <div class="row">
			<div class="col-1">1</div>
			<div class="col-7">Lenguaje Musical I</div>
			<div class="col-4 text-center">----</div>
		  </div>
		  <div class="row">
			<div class="col-1">2</div>
			<div class="col-7">Instrumento I</div>
			<div class="col-4 text-center">----</div>
		  </div>
		  
		  <!-- 2do Año -->
		  <div class="row text-center">
			<div class="col-12">
			  <h4>2do Año</h4>
			</div>
		  </div>
		  <div class="row">
			<div class="col-1">3</div>
			<div class="col-7">Lenguaje Musical II</div>
			<div class="col-4 text-center">1</div>
		  </div>
		  <div class="row">
			<div class="col-1">4</div>
			<div class="col-7">Instrumento II</div>
			<div class="col-4 text-center">1, 2</div>
		  </div>
		  <div class="row">
			<div class="col-1">5</div>
			<div class="col-7">Práctica de Conjunto Vocal e Instrumental I</div>
			<div class="col-4 text-center">1, 2</div>
		  </div>
		  <div class="row">
			<div class="col-1">6</div>
			<div class="col-7">Práctica Coral</div>
			<div class="col-4 text-center">1</div>
		  </div>
		  <div class="row">
			<div class="col-1">7</div>
			<div class="col-7">Apreciación Musical I</div>
			<div class="col-4 text-center">1, 2</div>
		  </div>
		  
		  <!-- 3er Año -->
		  <div class="row text-center">
			<div class="col-12">
			  <h4>3er Año</h4>
			</div>
		  </div>
		  <div class="row">
			<div class="col-1">8</div>
			<div class="col-7">Lenguaje Musical III</div>
			<div class="col-4 text-center">3</div>
		  </div>
		  <div class="row">
			<div class="col-1">9</div>
			<div class="col-7">Instrumento III</div>
			<div class="col-4 text-center">3, 4</div>
		  </div>
		  <div class="row">
			<div class="col-1">10</div>
			<div class="col-7">Práctica de Conjunto Vocal e Instrumental II</div>
			<div class="col-4 text-center">3, 4, 5</div>
		  </div>
		  <div class="row">
			<div class="col-1">11</div>
			<div class="col-7">Apreciación Musical II</div>
			<div class="col-4 text-center">3, 4, 7</div>
		  </div>
		  <div class="row">
			<div class="col-1">12</div>
			<div class="col-7">Instrumento Armónico</div>
			<div class="col-4 text-center">3</div>
		  </div>
		</div>
		<div id='fobacanto' style='display:none'>
		  <div class="row">
			<div class="col-12 text-center">
			  <h3 class='text-center'>FOBA de Canto Lírico-Camarístico</h3>
			</div>
		  </div>
		  <div class="row">
			<div class="col-12">
			  <p>Total asignaturas: 20</p>
			  <p>Duración: 3 años</p>
			  <p>Requisitos:</p>
			  <ul>
				<li>Edad mínima: 14 años (cumplidos a Julio del ciclo lectivo a cursar)</li>
				<li>Cursando o Estudios Secundarios terminados</li>
				<li>Certificado oficial de Salud Fonoaudiológico (O.R.L.)</li>
			  </ul>
			</div>
		  </div>
		  <div class="row">
			<div class="col-12">
			  Correlatividad/es*: Asignaturas (identificadas por número de orden) que deben ser acreditadas al comienzo del Ciclo Lectivo correspondiente o en condiciones de compensar hasta Julio-Agosto por ser materias correlativas.
			</div>
		  </div>
		  
		  <!-- 1er Año -->
		  <div class="row text-center">
			<div class="col-12">
			  <h4>1er Año</h4>
			</div>
		  </div>
		  <div class="row">
			<div class="col-1"><b>Nº</b></div>
			<div class="col-7"><b>Materia</b></div>
			<div class="col-4 text-center"><b>Correlatividad/es*</b></div>
		  </div>
		  <div class="row">
			<div class="col-1">1</div>
			<div class="col-7">Lenguaje Musical I</div>
			<div class="col-4 text-center">---</div>
		  </div>
		  <div class="row">
			<div class="col-1">2</div>
			<div class="col-7">Canto I</div>
			<div class="col-4 text-center">---</div>
		  </div>
		  <div class="row">
			<div class="col-1">3</div>
			<div class="col-7">Trabajo Corporal I</div>
			<div class="col-4 text-center">---</div>
		  </div>
		  <div class="row">
			<div class="col-1">4</div>
			<div class="col-7">Foniatría I</div>
			<div class="col-4 text-center">---</div>
		  </div>
		  <div class="row">
			<div class="col-1">5</div>
			<div class="col-7">Dicción Italiana</div>
			<div class="col-4 text-center">---</div>
		  </div>
		  
		  <!-- 2do Año -->
		  <div class="row text-center">
			<div class="col-12">
			  <h4>2do Año</h4>
			</div>
		  </div>
		  <div class="row">
			<div class="col-1">6</div>
			<div class="col-7">Lenguaje Musical II</div>
			<div class="col-4 text-center">1</div>
		  </div>
		  <div class="row">
			<div class="col-1">7</div>
			<div class="col-7">Canto II</div>
			<div class="col-4 text-center">1, 2</div>
		  </div>
		  <div class="row">
			<div class="col-1">8</div>
			<div class="col-7">Repertorio de Canto I</div>
			<div class="col-4 text-center">1, 2</div>
		  </div>
		  <div class="row">
			<div class="col-1">9</div>
			<div class="col-7">Instrumento Armónico (piano) I</div>
			<div class="col-4 text-center">1</div>
		  </div>
		  <div class="row">
			<div class="col-1">10</div>
			<div class="col-7">Trabajo Corporal II</div>
			<div class="col-4 text-center">3</div>
		  </div>
		  <div class="row">
			<div class="col-1">11</div>
			<div class="col-7">Foniatría II</div>
			<div class="col-4 text-center">4</div>
		  </div>
		  <div class="row">
			<div class="col-1">12</div>
			<div class="col-7">Dicción Alemana</div>
			<div class="col-4 text-center">---</div>
		  </div>
		  <div class="row">
			<div class="col-1">13</div>
			<div class="col-7">Apreciación Musical I</div>
			<div class="col-4 text-center">1, 2</div>
		  </div>
		  
		  <!-- 3er Año -->
		  <div class="row text-center">
			<div class="col-12">
			  <h4>3er Año</h4>
			</div>
		  </div>
		  <div class="row">
			<div class="col-1">14</div>
			<div class="col-7">Lenguaje Musical III</div>
			<div class="col-4 text-center">6</div>
		  </div>
		  <div class="row">
			<div class="col-1">15</div>
			<div class="col-7">Canto III</div>
			<div class="col-4 text-center">5, 6, 7, 8</div>
		  </div>
		  <div class="row">
			<div class="col-1">16</div>
			<div class="col-7">Repertorio de Canto II</div>
			<div class="col-4 text-center">5, 6, 7, 8</div>
		  </div>
		  <div class="row">
			<div class="col-1">17</div>
			<div class="col-7">Instrumento Armónico (piano) II</div>
			<div class="col-4 text-center">9, 6</div>
		  </div>
		  <div class="row">
			<div class="col-1">18</div>
			<div class="col-7">Práctica de Conjunto Vocal e Instrumental I</div>
			<div class="col-4 text-center">2, 6</div>
		  </div>
		  <div class="row">
			<div class="col-1">19</div>
			<div class="col-7">Apreciación Musical II</div>
			<div class="col-4 text-center">13, 6, 7</div>
		  </div>
		  <div class="row">
			<div class="col-1">20</div>
			<div class="col-7">Dicción Francesa</div>
			<div class="col-4 text-center">---</div>
		  </div>
		</div>
	</div>
</div>