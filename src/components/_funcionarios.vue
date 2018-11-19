<template>
  <section id="funcionarios">
    <div class="funcionarios">
      <div class="funcionarios_header">
        <div class="funcionarios_search">
          <el-input placeholder="Buscar funcionarios" v-model="searchValue">
            <!-- <el-select v-model="dependencia" slot="prepend" placeholder="Select">
              <el-option v-for="dependencia in dependencias" :label="dependencia.nombreDependencia" :value="dependencia.idDependencia" :key="dependencia.idDependencia"></el-option>
            </el-select> -->
            <el-button slot="append" icon="search"></el-button>
          </el-input>
        </div>
        <router-link v-if="allow(1)" to="/funcionarios/crear" v-show="$route.name != 'funcionariosCrear'" class="funcionarios__create"><i class="material-icons">add</i>Nuevo</router-link>
      </div>
      <router-view></router-view>
      <div class="funcionarios_list" v-show="funcionariosFiltered.length != 0  && (searchValue != '' || dependencia != '')">
          <div class="funcionarios_item" v-for="(funcionario, index) in funcionariosFiltered">
            <div class="funcionarios_item_foto">
              <img :src="setPhotoFuncionario(funcionario.imagen)" :alt="funcionario.nombreUsuario">
            </div>
            <div class="funcionarios_item_content">
              <div class="funcionarios_item_texts">
                <p class="funcionarios_item_name">{{ funcionario.nombreUsuario | capitalize }}</p>
                <p class="funcionarios_item_job">{{ funcionario.cargo | capitalize }}</p>
              </div>
              <div class="funcionarios_item_actions">
                <button class="funcionarios_item_action" v-on:click="redirectToChat(funcionario.nombreUsuario)">
                    <svg width="23px" height="22px" viewBox="0 0 23 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
                        <title>conversations icon</title>
                        <desc>Created with Sketch.</desc>
                        <defs></defs>
                        <g id="ooto-Productivity-Dashboards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Funcionarios" transform="translate(-24.000000, -550.000000)" fill="#9B9B9B">
                                <g id="icons" transform="translate(24.000000, 185.000000)">
                                    <g id="conversations-icon" transform="translate(0.000000, 365.000000)">
                                        <path d="M14.0873436,21.8272464 C11.6541688,21.8272464 9.33488139,20.6529574 7.88095096,18.6702263 L8.63148712,18.1066241 C9.92905585,19.8751204 11.9169498,20.8855551 14.0868768,20.8855551 L14.1013461,20.8855551 C15.1590046,20.8855551 16.1723218,20.6491906 17.1128258,20.1745782 C17.2864573,20.0874717 17.4964954,20.1209018 17.6383878,20.2541511 C18.3814559,20.9467651 20.2083207,20.8855551 21.4214074,20.7264093 C19.9007315,18.7832293 20.228391,17.0415712 20.2447273,16.9601149 C20.2517285,16.9257432 20.2624638,16.892784 20.2769331,16.8602956 C20.6830068,15.9572137 20.8874439,14.9924509 20.8851101,13.9919039 C20.8813761,12.0661452 20.1140369,10.2816402 18.7254517,8.96656827 L19.3644342,8.27960446 C20.9196497,9.75240966 21.814412,11.8340183 21.8186128,13.9904914 C21.8209466,15.1054539 21.5973727,16.1822779 21.1530254,17.191771 C21.1152185,17.4738075 20.9938632,19.0421944 22.662966,20.7184049 C22.7843213,20.8403539 22.8291295,21.0192753 22.7810541,21.1854838 C22.7325119,21.3507506 22.5980875,21.4764664 22.4305238,21.5127215 C22.051055,21.5941778 18.8463403,22.2307612 17.2617194,21.1468745 C16.2675391,21.6012405 15.2061465,21.8272464 14.1032131,21.8272464 L14.0873436,21.8272464 Z" id="Fill-1"></path>
                                        <path d="M6.12979327,15.5246478 C6.20027272,15.5246478 6.27168568,15.5406565 6.33749762,15.5736157 C7.33074447,16.0722413 8.4000718,16.3250854 9.51560751,16.3250854 C13.4685246,16.3250854 16.6844414,13.0630667 16.6844414,9.05381597 C16.6844414,5.04409439 13.4685246,1.78207571 9.51560751,1.78207571 C5.56269039,1.78207571 2.34677364,5.04409439 2.34677364,9.05381597 C2.34677364,10.1099228 2.56427976,11.1269494 2.99415775,12.0780576 C3.00862704,12.1100751 3.01936232,12.1435051 3.02683034,12.1783477 C3.04410014,12.2630999 3.3936969,14.1012814 1.77873725,16.1504016 C2.21748352,16.2083157 2.78832041,16.2629338 3.37596035,16.2629338 C4.54237195,16.2629338 5.38439138,16.0515241 5.81193561,15.6508344 C5.90061836,15.5679656 6.01450569,15.5246478 6.12979327,15.5246478 M9.51560751,17.2667767 C8.35526367,17.2667767 7.23832771,17.024762 6.19233795,16.5468537 C5.56502415,16.9837985 4.62031943,17.2046251 3.3764271,17.2046251 L3.37596035,17.2046251 C2.03545049,17.2046251 0.817696239,16.9494267 0.766820343,16.9385973 C0.598789859,16.9032838 0.463898721,16.7775681 0.415356581,16.6123012 C0.36634769,16.4460927 0.411622571,16.2671714 0.53297792,16.1447515 C2.29309723,14.3691925 2.16053985,12.7108742 2.11899898,12.4109455 C1.65038063,11.3534261 1.41327095,10.2238674 1.41327095,9.05381597 C1.41327095,4.52522248 5.04786366,0.840384404 9.51560751,0.840384404 C13.9833514,0.840384404 17.6179441,4.52522248 17.6179441,9.05381597 C17.6179441,13.5824095 13.9833514,17.2667767 9.51560751,17.2667767" id="Fill-4"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                  Mensaje</button>
                <button class="funcionarios_item_action" v-on:click="redirectToProfile(funcionario, index)">
                  <svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
                      <title>meetings icon</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="ooto-Productivity-Dashboards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="Funcionarios" transform="translate(-26.000000, -405.000000)" fill="#9B9B9B">
                              <g id="icons" transform="translate(24.000000, 185.000000)">
                                  <g id="meetings-icon" transform="translate(2.000000, 220.000000)">
                                      <path d="M5.72240134,8.16124495 C5.74403344,8.17491331 5.76831438,8.1894635 5.79347826,8.20533643 C5.99832107,8.33231989 6.14621405,8.42403017 6.20272241,8.61759178 C6.42345819,9.38390171 7.91783946,12.2317705 9.93889632,12.2317705 C11.9581873,12.2317705 13.453893,9.3834608 13.6746288,8.61891452 C13.7298127,8.42535292 13.8785886,8.33276081 14.0838729,8.20489551 C14.1090368,8.1894635 14.1333177,8.17491331 14.1545084,8.16124495 C14.6957525,7.17668218 14.6105485,6.73709011 14.5469766,6.59158822 C14.4697191,6.41478139 14.3072575,6.37157173 14.2891572,6.36716259 C14.082107,6.31778013 13.9271505,6.12421853 13.9386288,5.91169759 C13.9390702,5.90067472 13.9955786,4.77325555 13.7214247,3.73931032 C13.6949365,3.64319089 13.0013846,1.2913513 9.93889632,1.2913513 C6.85256856,1.2913513 6.16210702,3.71682366 6.15548495,3.74151489 C5.88044816,4.77854653 5.93828094,5.9002338 5.93872241,5.91125667 C5.95152508,6.13303682 5.79656856,6.32924391 5.57804013,6.36936716 C5.56965217,6.37157173 5.40719064,6.41478139 5.32993311,6.59158822 C5.26680268,6.73709011 5.18115719,7.17668218 5.72240134,8.16124495 M9.93889632,13.1136001 C7.50329766,13.1136001 5.80319064,10.1903349 5.39703679,8.99721943 C5.37496321,8.98311015 5.35068227,8.96855996 5.32728428,8.95400978 C5.16835452,8.85568577 5.06328428,8.79043038 4.99441472,8.66741515 C4.40946488,7.63435175 4.25494983,6.80631374 4.53528428,6.20799234 C4.66905017,5.92139771 4.87212709,5.74811819 5.05048161,5.64494413 C5.05004013,5.19785651 5.08270903,4.34336361 5.30256187,3.51356194 C5.3113913,3.48093424 6.18373913,0.409521675 9.93889632,0.409521675 C13.6940535,0.409521675 14.5659599,3.48093424 14.5747893,3.51179828 C14.7950836,4.34292269 14.8277525,5.19785651 14.827311,5.64494413 C15.0052241,5.74811819 15.208301,5.92139771 15.3420669,6.20755142 C15.6224013,6.80631374 15.4674448,7.63435175 14.882495,8.66873789 C14.8140669,8.79043038 14.7089967,8.85524486 14.5500669,8.95356886 C14.5266689,8.96855996 14.5028294,8.98311015 14.4803144,8.99721943 C14.0723946,10.1925395 12.3714047,13.1136001 9.93889632,13.1136001" id="Fill-1"></path>
                                      <path d="M13.1235398,13.2524442 C13.0551117,13.2524442 12.9858007,13.2365712 12.9204629,13.2030617 C12.0251585,12.7387784 11.7585097,12.2859589 11.7143625,12.1999805 C11.6031117,11.9834913 11.6883157,11.7176197 11.9050783,11.6065092 C12.1200749,11.4967214 12.3796602,11.5782906 12.4935599,11.7855206 C12.5072455,11.8071254 12.6992856,12.0950428 13.3274997,12.419997 C13.5438207,12.5324303 13.6281418,12.7983019 13.516008,13.0143502 C13.4374261,13.1660249 13.282911,13.2524442 13.1235398,13.2524442" id="Fill-4"></path>
                                      <path d="M10.1690355,20.7229961 C5.09034649,20.7229961 0.438560535,19.8790851 0.388674247,19.8698259 C0.171470234,19.8301436 0.0169551839,19.6357001 0.0271090301,19.4152427 C0.237249498,15.0184403 2.9796709,13.6529271 5.02456722,13.0087505 C6.61783813,12.5065486 7.45177793,11.6935017 7.45972441,11.6851243 C7.63322274,11.5140493 7.91267425,11.5149312 8.08396522,11.6877698 C8.25569766,11.8610493 8.25481472,12.1401484 8.08131639,12.3116642 C8.04158395,12.3509057 7.08535652,13.2838814 5.28989164,13.8495751 C3.29797191,14.4774378 1.23938997,15.5938341 0.935216054,19.0686837 C2.25742341,19.2851729 6.76528963,19.9513951 11.3464401,19.8248526 C11.5941057,19.8186798 11.7936508,20.0100368 11.8002729,20.2534218 C11.806895,20.4968068 11.6148548,20.6996276 11.371604,20.7062413 C10.9689819,20.7177051 10.5676843,20.7229961 10.1690355,20.7229961" id="Fill-6"></path>
                                      <path d="M14.0077632,14.9747456 L14.0077632,19.8248085 L19.3058635,19.8248085 L19.3054221,14.9747456 L14.0077632,14.9747456 Z M19.3054221,20.7066381 L14.0077632,20.7066381 C13.5208201,20.7066381 13.1248201,20.3111375 13.1248201,19.8248085 L13.1248201,14.9747456 C13.1248201,14.4884166 13.5208201,14.092916 14.0077632,14.092916 L19.3054221,14.092916 C19.7923652,14.092916 20.1883652,14.4884166 20.1883652,14.9747456 L20.1883652,19.8248085 C20.1883652,20.3111375 19.7923652,20.7066381 19.3054221,20.7066381 L19.3054221,20.7066381 Z" id="Fill-9"></path>
                                      <path d="M19.3054221,17.1793196 L14.0077632,17.1793196 C13.7636294,17.1793196 13.5662916,16.9817898 13.5662916,16.7384048 C13.5662916,16.4950199 13.7636294,16.29749 14.0077632,16.29749 L19.3054221,16.29749 C19.5495559,16.29749 19.7468936,16.4950199 19.7468936,16.7384048 C19.7468936,16.9817898 19.5495559,17.1793196 19.3054221,17.1793196" id="Fill-12"></path>
                                      <path d="M15.3321779,15.8565752 C15.0880441,15.8565752 14.8907064,15.6590454 14.8907064,15.4156604 L14.8907064,13.6520012 C14.8907064,13.4086162 15.0880441,13.2110864 15.3321779,13.2110864 C15.5763117,13.2110864 15.7736495,13.4086162 15.7736495,13.6520012 L15.7736495,15.4156604 C15.7736495,15.6590454 15.5763117,15.8565752 15.3321779,15.8565752" id="Fill-14"></path>
                                      <path d="M17.9810074,15.8565752 C17.7368736,15.8565752 17.5395358,15.6590454 17.5395358,15.4156604 L17.5395358,13.6520012 C17.5395358,13.4086162 17.7368736,13.2110864 17.9810074,13.2110864 C18.2251411,13.2110864 18.4224789,13.4086162 18.4224789,13.6520012 L18.4224789,15.4156604 C18.4224789,15.6590454 18.2251411,15.8565752 17.9810074,15.8565752" id="Fill-16"></path>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </svg>
                Perfil</button>
              </div>
            </div>
          </div>
      </div>
      <div v-show="funcionariosFiltered.length == 0" v-for="dependencia in dependenciasFiltered" class="funcionarios_dependencia">
        <div class="funcionarios_dependencia_header">
          <h2>{{dependencia.nombreDependencia | capitalize }}</h2>
          <hr>
        </div>
        <div class="funcionarios_list">
            <div :class="{funcionarios_item: true, leader: funcionario.id == dependencia.idUsuario}" v-for="(funcionario, index) in dependencia.funcionarios">
              <div class="funcionarios_item_foto">
                <img :src="setPhotoFuncionario(funcionario.imagen)" :alt="funcionario.nombreUsuario">
              </div>
              <div class="funcionarios_item_content">
                <div class="funcionarios_item_texts">
                  <p class="funcionarios_item_name">{{ funcionario.nombreUsuario | capitalize }}</p>
                  <p class="funcionarios_item_job">{{ funcionario.cargo | capitalize }}{{ funcionario.contrato | contrato }}</p>
                </div>
                <div class="funcionarios_item_actions">
                  <button class="funcionarios_item_action" v-on:click="redirectToChat(funcionario.nombreUsuario)">
                      <svg width="23px" height="22px" viewBox="0 0 23 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
                          <title>conversations icon</title>
                          <desc>Created with Sketch.</desc>
                          <defs></defs>
                          <g id="ooto-Productivity-Dashboards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <g id="Funcionarios" transform="translate(-24.000000, -550.000000)" fill="#9B9B9B">
                                  <g id="icons" transform="translate(24.000000, 185.000000)">
                                      <g id="conversations-icon" transform="translate(0.000000, 365.000000)">
                                          <path d="M14.0873436,21.8272464 C11.6541688,21.8272464 9.33488139,20.6529574 7.88095096,18.6702263 L8.63148712,18.1066241 C9.92905585,19.8751204 11.9169498,20.8855551 14.0868768,20.8855551 L14.1013461,20.8855551 C15.1590046,20.8855551 16.1723218,20.6491906 17.1128258,20.1745782 C17.2864573,20.0874717 17.4964954,20.1209018 17.6383878,20.2541511 C18.3814559,20.9467651 20.2083207,20.8855551 21.4214074,20.7264093 C19.9007315,18.7832293 20.228391,17.0415712 20.2447273,16.9601149 C20.2517285,16.9257432 20.2624638,16.892784 20.2769331,16.8602956 C20.6830068,15.9572137 20.8874439,14.9924509 20.8851101,13.9919039 C20.8813761,12.0661452 20.1140369,10.2816402 18.7254517,8.96656827 L19.3644342,8.27960446 C20.9196497,9.75240966 21.814412,11.8340183 21.8186128,13.9904914 C21.8209466,15.1054539 21.5973727,16.1822779 21.1530254,17.191771 C21.1152185,17.4738075 20.9938632,19.0421944 22.662966,20.7184049 C22.7843213,20.8403539 22.8291295,21.0192753 22.7810541,21.1854838 C22.7325119,21.3507506 22.5980875,21.4764664 22.4305238,21.5127215 C22.051055,21.5941778 18.8463403,22.2307612 17.2617194,21.1468745 C16.2675391,21.6012405 15.2061465,21.8272464 14.1032131,21.8272464 L14.0873436,21.8272464 Z" id="Fill-1"></path>
                                          <path d="M6.12979327,15.5246478 C6.20027272,15.5246478 6.27168568,15.5406565 6.33749762,15.5736157 C7.33074447,16.0722413 8.4000718,16.3250854 9.51560751,16.3250854 C13.4685246,16.3250854 16.6844414,13.0630667 16.6844414,9.05381597 C16.6844414,5.04409439 13.4685246,1.78207571 9.51560751,1.78207571 C5.56269039,1.78207571 2.34677364,5.04409439 2.34677364,9.05381597 C2.34677364,10.1099228 2.56427976,11.1269494 2.99415775,12.0780576 C3.00862704,12.1100751 3.01936232,12.1435051 3.02683034,12.1783477 C3.04410014,12.2630999 3.3936969,14.1012814 1.77873725,16.1504016 C2.21748352,16.2083157 2.78832041,16.2629338 3.37596035,16.2629338 C4.54237195,16.2629338 5.38439138,16.0515241 5.81193561,15.6508344 C5.90061836,15.5679656 6.01450569,15.5246478 6.12979327,15.5246478 M9.51560751,17.2667767 C8.35526367,17.2667767 7.23832771,17.024762 6.19233795,16.5468537 C5.56502415,16.9837985 4.62031943,17.2046251 3.3764271,17.2046251 L3.37596035,17.2046251 C2.03545049,17.2046251 0.817696239,16.9494267 0.766820343,16.9385973 C0.598789859,16.9032838 0.463898721,16.7775681 0.415356581,16.6123012 C0.36634769,16.4460927 0.411622571,16.2671714 0.53297792,16.1447515 C2.29309723,14.3691925 2.16053985,12.7108742 2.11899898,12.4109455 C1.65038063,11.3534261 1.41327095,10.2238674 1.41327095,9.05381597 C1.41327095,4.52522248 5.04786366,0.840384404 9.51560751,0.840384404 C13.9833514,0.840384404 17.6179441,4.52522248 17.6179441,9.05381597 C17.6179441,13.5824095 13.9833514,17.2667767 9.51560751,17.2667767" id="Fill-4"></path>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </svg>
                    Mensaje</button>
                  <button class="funcionarios_item_action" v-on:click="redirectToProfile(funcionario, index)">
                    <svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
                        <title>meetings icon</title>
                        <desc>Created with Sketch.</desc>
                        <defs></defs>
                        <g id="ooto-Productivity-Dashboards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Funcionarios" transform="translate(-26.000000, -405.000000)" fill="#9B9B9B">
                                <g id="icons" transform="translate(24.000000, 185.000000)">
                                    <g id="meetings-icon" transform="translate(2.000000, 220.000000)">
                                        <path d="M5.72240134,8.16124495 C5.74403344,8.17491331 5.76831438,8.1894635 5.79347826,8.20533643 C5.99832107,8.33231989 6.14621405,8.42403017 6.20272241,8.61759178 C6.42345819,9.38390171 7.91783946,12.2317705 9.93889632,12.2317705 C11.9581873,12.2317705 13.453893,9.3834608 13.6746288,8.61891452 C13.7298127,8.42535292 13.8785886,8.33276081 14.0838729,8.20489551 C14.1090368,8.1894635 14.1333177,8.17491331 14.1545084,8.16124495 C14.6957525,7.17668218 14.6105485,6.73709011 14.5469766,6.59158822 C14.4697191,6.41478139 14.3072575,6.37157173 14.2891572,6.36716259 C14.082107,6.31778013 13.9271505,6.12421853 13.9386288,5.91169759 C13.9390702,5.90067472 13.9955786,4.77325555 13.7214247,3.73931032 C13.6949365,3.64319089 13.0013846,1.2913513 9.93889632,1.2913513 C6.85256856,1.2913513 6.16210702,3.71682366 6.15548495,3.74151489 C5.88044816,4.77854653 5.93828094,5.9002338 5.93872241,5.91125667 C5.95152508,6.13303682 5.79656856,6.32924391 5.57804013,6.36936716 C5.56965217,6.37157173 5.40719064,6.41478139 5.32993311,6.59158822 C5.26680268,6.73709011 5.18115719,7.17668218 5.72240134,8.16124495 M9.93889632,13.1136001 C7.50329766,13.1136001 5.80319064,10.1903349 5.39703679,8.99721943 C5.37496321,8.98311015 5.35068227,8.96855996 5.32728428,8.95400978 C5.16835452,8.85568577 5.06328428,8.79043038 4.99441472,8.66741515 C4.40946488,7.63435175 4.25494983,6.80631374 4.53528428,6.20799234 C4.66905017,5.92139771 4.87212709,5.74811819 5.05048161,5.64494413 C5.05004013,5.19785651 5.08270903,4.34336361 5.30256187,3.51356194 C5.3113913,3.48093424 6.18373913,0.409521675 9.93889632,0.409521675 C13.6940535,0.409521675 14.5659599,3.48093424 14.5747893,3.51179828 C14.7950836,4.34292269 14.8277525,5.19785651 14.827311,5.64494413 C15.0052241,5.74811819 15.208301,5.92139771 15.3420669,6.20755142 C15.6224013,6.80631374 15.4674448,7.63435175 14.882495,8.66873789 C14.8140669,8.79043038 14.7089967,8.85524486 14.5500669,8.95356886 C14.5266689,8.96855996 14.5028294,8.98311015 14.4803144,8.99721943 C14.0723946,10.1925395 12.3714047,13.1136001 9.93889632,13.1136001" id="Fill-1"></path>
                                        <path d="M13.1235398,13.2524442 C13.0551117,13.2524442 12.9858007,13.2365712 12.9204629,13.2030617 C12.0251585,12.7387784 11.7585097,12.2859589 11.7143625,12.1999805 C11.6031117,11.9834913 11.6883157,11.7176197 11.9050783,11.6065092 C12.1200749,11.4967214 12.3796602,11.5782906 12.4935599,11.7855206 C12.5072455,11.8071254 12.6992856,12.0950428 13.3274997,12.419997 C13.5438207,12.5324303 13.6281418,12.7983019 13.516008,13.0143502 C13.4374261,13.1660249 13.282911,13.2524442 13.1235398,13.2524442" id="Fill-4"></path>
                                        <path d="M10.1690355,20.7229961 C5.09034649,20.7229961 0.438560535,19.8790851 0.388674247,19.8698259 C0.171470234,19.8301436 0.0169551839,19.6357001 0.0271090301,19.4152427 C0.237249498,15.0184403 2.9796709,13.6529271 5.02456722,13.0087505 C6.61783813,12.5065486 7.45177793,11.6935017 7.45972441,11.6851243 C7.63322274,11.5140493 7.91267425,11.5149312 8.08396522,11.6877698 C8.25569766,11.8610493 8.25481472,12.1401484 8.08131639,12.3116642 C8.04158395,12.3509057 7.08535652,13.2838814 5.28989164,13.8495751 C3.29797191,14.4774378 1.23938997,15.5938341 0.935216054,19.0686837 C2.25742341,19.2851729 6.76528963,19.9513951 11.3464401,19.8248526 C11.5941057,19.8186798 11.7936508,20.0100368 11.8002729,20.2534218 C11.806895,20.4968068 11.6148548,20.6996276 11.371604,20.7062413 C10.9689819,20.7177051 10.5676843,20.7229961 10.1690355,20.7229961" id="Fill-6"></path>
                                        <path d="M14.0077632,14.9747456 L14.0077632,19.8248085 L19.3058635,19.8248085 L19.3054221,14.9747456 L14.0077632,14.9747456 Z M19.3054221,20.7066381 L14.0077632,20.7066381 C13.5208201,20.7066381 13.1248201,20.3111375 13.1248201,19.8248085 L13.1248201,14.9747456 C13.1248201,14.4884166 13.5208201,14.092916 14.0077632,14.092916 L19.3054221,14.092916 C19.7923652,14.092916 20.1883652,14.4884166 20.1883652,14.9747456 L20.1883652,19.8248085 C20.1883652,20.3111375 19.7923652,20.7066381 19.3054221,20.7066381 L19.3054221,20.7066381 Z" id="Fill-9"></path>
                                        <path d="M19.3054221,17.1793196 L14.0077632,17.1793196 C13.7636294,17.1793196 13.5662916,16.9817898 13.5662916,16.7384048 C13.5662916,16.4950199 13.7636294,16.29749 14.0077632,16.29749 L19.3054221,16.29749 C19.5495559,16.29749 19.7468936,16.4950199 19.7468936,16.7384048 C19.7468936,16.9817898 19.5495559,17.1793196 19.3054221,17.1793196" id="Fill-12"></path>
                                        <path d="M15.3321779,15.8565752 C15.0880441,15.8565752 14.8907064,15.6590454 14.8907064,15.4156604 L14.8907064,13.6520012 C14.8907064,13.4086162 15.0880441,13.2110864 15.3321779,13.2110864 C15.5763117,13.2110864 15.7736495,13.4086162 15.7736495,13.6520012 L15.7736495,15.4156604 C15.7736495,15.6590454 15.5763117,15.8565752 15.3321779,15.8565752" id="Fill-14"></path>
                                        <path d="M17.9810074,15.8565752 C17.7368736,15.8565752 17.5395358,15.6590454 17.5395358,15.4156604 L17.5395358,13.6520012 C17.5395358,13.4086162 17.7368736,13.2110864 17.9810074,13.2110864 C18.2251411,13.2110864 18.4224789,13.4086162 18.4224789,13.6520012 L18.4224789,15.4156604 C18.4224789,15.6590454 18.2251411,15.8565752 17.9810074,15.8565752" id="Fill-16"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                  Perfil</button>
                </div>
              </div>
            </div>
        </div>
      </div>
      <button v-show="funcionariosFiltered.length == 0" v-on:click="infiniteHandler" class="funcionarios_action_moreQuantity">Ver mas dependencias</button>
    </div>
  </section>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
export default {
  components: { InfiniteLoading },
  created(){
    if(this.$store.state.dependenciasData.length != 0){
      this.infiniteHandler();
    }
  },
  mounted(){
    this.filterFuncionarios();
  },
  data(){
    return {
      searchValue: '',
      dependencia: 1,
      funcionariosFiltered: [],
      dependenciasFiltered: [],
      indexInfiniteLoading: 3,
    }
  },
  watch: {
    searchValue(value) {
      this.filterFuncionarios();
    },
    dependencia() {
      this.filterFuncionarios();
    },
    dependencias() {
      this.infiniteHandler();
    }
  },
  computed: {
    currentUser(){
      return this.$store.state.currentUser;
    },
    dependencias(){
      return this.$store.state.dependenciasData;
    }
  },
  methods: {
    infiniteHandler(){
      this.dependenciasFiltered = this.dependencias.slice(0, this.indexInfiniteLoading);
      this.indexInfiniteLoading++;
    },
    setPhotoFuncionario(photo){
      return `${this.$urlHttp}/imagenes_usuario/imagen_usuario/${photo}`;
    },
    redirectToProfile(funcionario, index){
      this.$router.push(`/funcionario/${funcionario.id}`);
    },
    redirectToChat(name){
      this.$store.state.backupSearchFuncionario = name;
      this.$router.push('chat');
    },
    filterFuncionarios(){
      let data = this.$store.state.funcionariosData;
      this.funcionariosFiltered = data.filter(funcionario =>  funcionario.nombreUsuario.toLowerCase().includes(this.searchValue.toLowerCase()))
      if(this.dependencia != 1){
        if(this.searchValue == ''){
          this.funcionariosFiltered = data.filter(funcionario =>  funcionario.idDependencia == this.dependencia)
        }else{
          this.funcionariosFiltered = this.funcionariosFiltered.filter(funcionario =>  funcionario.idDependencia == this.dependencia)
        }
      }else{
        this.funcionariosFiltered = [];
        if(this.searchValue != ''){
          this.funcionariosFiltered = data.filter(funcionario =>  funcionario.nombreUsuario.toLowerCase().includes(this.searchValue.toLowerCase()))
        }
      }
    },
    allow(value = 0){
      if(this.currentUser.tipoUsuario == 1){
        return true;
      }else{
        if(this.currentUser.tipoUsuario == 2){
          switch (value) {
            case 1:
              return false;
            break;
            default:
              return true;
          }
        }else{
          switch (value) {
            case 2:
              return true;
            break;
            default:
              return false;
          }
        }
      }
    }
  },
  filters: {
    capitalize(value){
      if(value){
        value = value.toLowerCase();
        return value.replace(/^\w|\s\w/g, l => l.toUpperCase())
      }
    },
    contrato(value){
      if(value){
        if(value == 1){
          return ' - Contratista'
        }
      }
    }
  }
}
</script>

<style scoped>
  .funcionarios{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-select .el-input {
    width: 110px;
  }
  .funcionarios_header{
    max-width: 1200px;
    width: 95%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 10px 0 10px;
    margin-bottom: 30px;
  }
  .funcionarios_search{
    max-width: 420px;
    width: 100%;
  }
  .funcionarios__create{
    display: flex;
    align-items: center;
    border-style: none;
    padding: 8px 30px;
    background-color: #5ca840;
    border-radius: 6px;
    color: #FFF;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .funcionarios__create i{
    display: flex;
    color: #FFF;
    margin-right: 5px;
    font-weight: 900;
    font-size: 17px;
  }
  .funcionarios__create:hover{
    transform: scale(0.95);
  }
  .funcionarios__title{
    font-weight: 500;
    color: #4a4a4a;
  }
  .funcionarios_split{
      width: 100%;
      margin: 20px 0;
      opacity: 0.3;
  }
  .funcionarios_dependencia{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .funcionarios_dependencia_header{
    max-width: 1200px;
    width: 95%;
  }
  .funcionarios_dependencia_header h2{
    color: #393939;
    font-size: 24px;
    font-weight: 500;
  }
  .funcionarios_dependencia_header hr{
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid rgba(151, 151, 151, 0.37);
    margin: 10px 0;
    padding: 0;
  }
  .funcionarios_list{
    max-width: 1200px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .funcionarios_item{
    max-width: 280px;
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    background-color: #FFF;
    box-shadow: 2px 2px 7px 0 rgba(155, 155, 155, 0.2);
    margin: 10px;
    overflow: hidden;
    background-image: linear-gradient(179deg, rgba(234, 236, 237, 0.21), rgba(255, 252, 252, 0.99), #fffcfc);
    transition: .3s;
  }
  .funcionarios_item:hover{
    /*justify-content: space-between;*/
    transform: scale(1.04);
  }
  .funcionarios_item > div{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .funcionarios_item_texts{
    line-height: 1.5;
  }
  .funcionarios_item_name{
    width: 100%;
    font-weight: 500;
    text-align: center;
    color: rgba(74, 74, 74, 0.81);
  }
  .funcionarios_item_job{
    font-size: 14px;
    color: #9b9b9b;
    text-align: center;
  }
  .funcionarios_item_foto{
    width: 150px;
    min-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 15px 0 35px 0;
    transition: .3s;
  }
  .funcionarios_item_foto img{
    max-width: 100%;
    width: 100%;
  }
  .funcionarios_item_content{
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: -20px;
    transition: .3s;
  }
  .funcionarios_item:hover .funcionarios_item_content{
    margin-bottom: 0px;
  }
  .funcionarios_item_text{
    font-size: 15px;
  }
  .funcionarios_item_actions{
    width: 100%;
    display: flex;
    border-top: 1px solid rgba(151, 151, 151, 0.37);;
    opacity: 0;
    transition: .3s;
  }
  .funcionarios_item_actions button{
    width: 50%;
  }
  .funcionarios_item:hover .funcionarios_item_actions{
    margin-bottom: 0px;
    opacity: 1;
  }
  .funcionarios_item:hover > .funcionarios_item_foto{
    margin: 0px 0 0px 0;
    transform: scale(0.75);
  }
  .funcionarios_item_action{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    padding: 10px 0px;
    border-style: none;
    color: #898989;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .funcionarios_item_action svg{
    margin-right: 10px;
  }
  .funcionarios_item_action:nth-child(1){
    border-right: 1px solid rgba(151, 151, 151, 0.37);
  }
  .funcionarios_action_moreQuantity{
    display: flex;
    align-items: center;
    border-style: none;
    padding: 10px 50px;
    margin: 30px 0;
    background-color: #4192ec;
    border-radius: 10px;
    color: #FFF;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .funcionarios_action_moreQuantity:hover{
    transform: scale(0.95);
  }
  @media(min-width: 620px){
    .funcionarios_item.leader{
      max-width: 580px;
      padding: 0 50px;
      flex-direction: row-reverse;
      background-image: linear-gradient(107deg, rgba(223, 228, 230, 0.39), rgba(193, 201, 209, 0.53));
      box-shadow: 2px 2px 7px 0 rgba(155, 155, 155, 0.2);
    }
    .funcionarios_item.leader:hover{
      transform: scale(1.02);
    }
    .funcionarios_item.leader .funcionarios_item_foto{
      width: 200px;
      height: 200px;
      margin: 0;
      box-shadow: 4px 4px 13px 0 rgba(0, 0, 0, 0.1);
    }
    .funcionarios_item.leader:hover .funcionarios_item_foto{
      transform: scale(0.9);
    }
    .funcionarios_item.leader .funcionarios_item_content{
      width: 50%;
      height: initial;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .funcionarios_item.leader .funcionarios_item_texts p{
      width: initial;
      text-align: left;
    }
    .funcionarios_item.leader .funcionarios_item_actions{
      opacity: 1;
      border: 0px;
      margin-top: 30px;
    }
    .funcionarios_item.leader .funcionarios_item_action{
      width: initial;
      border: 1px solid #9b9b9b;
      border-radius: 6px;
      padding: 5px 20px;
      margin-right: 15px;
    }
  }
  @media(max-width: 620px){
    .funcionarios_item.leader{
      background-image: linear-gradient(107deg, rgba(223, 228, 230, 0.39), rgba(193, 201, 209, 0.53));
    }
  }
</style>
