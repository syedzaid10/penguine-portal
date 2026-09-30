import React, { useState } from 'react';
import {
  GraduationCap,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpen,
  Compass,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function StudentZone({ isEmbedded = false }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('explainers'); // 'explainers' or 'quiz'
  const [selectedExplainer, setSelectedExplainer] = useState(0);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('');

  const explainers = [
    {
      id: 'ice-core',
      title: 'How Do Scientists Drill Ice Cores 3,000 Meters Deep?',
      subtitle: 'Unlocking 800,000 Years of Earth’s Climate History Through Trapped Air Bubbles',
      image: '/images/blue-ice-cavern.jpg',
      summary:
        'Ice sheets in Antarctica are formed from layers of compressed snow accumulating over hundreds of thousands of years. As fresh snow compacts into dense glacial ice, it permanently seals microscopic bubbles of atmospheric air.',
      sections: [
        {
          heading: '1. What is an Ice Core?',
          text: 'An ice core is a cylindrical sample drilled deep into glaciers and continental ice sheets. Each layer represents an individual year of snowfall, stacked like pages in a giant book of Earth’s atmosphere.',
        },
        {
          heading: '2. The Deep Drilling Technology',
          text: 'Using electromechanical and thermal drill barrels equipped with diamond and carbide cutters, scientists drill in 3-meter increments. At depths beyond 2,500 meters, special drilling fluids (such as ESTISOL) are pumped into the borehole to counteract enormous lithostatic ice pressure.',
        },
        {
          heading: '3. What Secrets Do They Reveal?',
          text: 'By analyzing the ratio of Oxygen-18 to Oxygen-16 (δ18O) isotopes in ice crystals, paleoclimatologists calculate the exact atmospheric temperature when the snow fell. The trapped air bubbles allow direct measurement of carbon dioxide (CO2) and methane (CH4) concentrations dating back 800,000 years.',
        },
        {
          heading: '4. India’s Mission in Dronning Maud Land',
          text: 'Indian scientists from NCPOR have conducted shallow firn drilling at Maitri and are preparing a deep drilling initiative in central Dronning Maud Land at 3,100 meters elevation to extract a pristine 100,000-year South Asian monsoon connection record.',
        },
      ],
    },
    {
      id: 'indarc',
      title: 'Why Is India’s IndARC Mooring Crucial for the Arctic?',
      subtitle: 'Monitoring High Arctic Fjord Hydrography and the Indian Monsoon Teleconnection',
      image: '/images/icebreaker-pack-ice.jpg',
      summary:
        'In July 2014, India deployed its first underwater observatory, IndARC, in Kongsfjorden fjord, Svalbard. Positioned halfway between Norway and the North Pole, it monitors ocean conditions continuously through harsh polar winter.',
      sections: [
        {
          heading: '1. An Underwater Marvel at 192 Meters Depth',
          text: 'Unlike surface buoys which would be crushed by floating sea ice and giant glaciers, IndARC is a subsurface mooring anchored to the fjord seabed. A buoyant string of high-tech oceanographic sensors floats upwards to within 30 meters of the surface.',
        },
        {
          heading: '2. Detecting the "Atlantification" of the Arctic',
          text: 'Kongsfjorden acts as a natural laboratory where cold, fresh Arctic water meets warm, salty Atlantic water. IndARC data revealed that pulses of warm Atlantic water are surging deeper into the fjord during late autumn, preventing winter sea ice from freezing.',
        },
        {
          heading: '3. The Arctic-Monsoon Connection',
          text: 'Why does India care about Arctic ice melt? Changes in Arctic sea ice cover shift the northern hemisphere polar jet stream, directly altering the timing, distribution, and intensity of the Indian summer monsoon rainfall.',
        },
      ],
    },
    {
      id: 'ozone-hole',
      title: 'The Antarctic Ozone Hole: Discovery, Chemistry & Healing',
      subtitle: 'How International Science Rescued the Planetary Sunscreen',
      image: '/images/polar-station-facility.jpg',
      summary:
        'The ozone layer in the stratosphere shields all living things from lethal ultraviolet (UV) radiation. In 1985, scientists discovered that human-made chemicals were rapidly destroying this shield over Antarctica.',
      sections: [
        {
          heading: '1. Why Does the Hole Form over Antarctica?',
          text: 'During the dark Antarctic winter, temperatures in the stratosphere drop below -80°C, creating Polar Stratospheric Clouds (PSCs). These clouds convert inert chlorine from CFCs into highly reactive radicals. When the sun returns in September, sunlight triggers rapid catalytic ozone destruction.',
        },
        {
          heading: '2. India’s 30-Year Ozonesonde Record at Maitri',
          text: 'Since 1989, scientists from IMD and NCPOR at Maitri station have launched weekly ozonesondes—weather balloons carrying electrochemical sensors up to 35 km altitude—monitoring the ozone layer in real-time.',
        },
        {
          heading: '3. The Montreal Protocol Success',
          text: 'Thanks to the global phaseout of chlorofluorocarbons under the Montreal Protocol, recent observations at Maitri confirm that the Antarctic ozone layer is healing at a rate of 1 to 3 percent per decade, projected to fully recover by 2060.',
        },
      ],
    },
  ];

  const quizQuestions = [
    {
      question: 'Where was India’s very first permanent Antarctic research station built in 1983?',
      options: ['Maitri', 'Dakshin Gangotri', 'Bharati', 'Himadri'],
      correct: 1,
      explanation:
        'Dakshin Gangotri was constructed in 1983 on the ice shelf during the 3rd Indian Antarctic Expedition, operating until 1990.',
    },
    {
      question: 'Which underwater mooring was deployed by India in 2014 in Kongsfjorden, Svalbard?',
      options: ['IndARC', 'Argo Float', 'DeepSea-1', 'Sagar Kanya'],
      correct: 0,
      explanation:
        'IndARC is India’s subsurface multi-sensor mooring in Svalbard, collecting continuous hydrographic data at 192m depth.',
    },
    {
      question: 'What is trapped inside ice cores that allows scientists to reconstruct ancient atmospheres?',
      options: ['Volcanic magma', 'Microscopic air bubbles', 'Liquid water pockets', 'Fossilized fish'],
      correct: 1,
      explanation:
        'As snow compacts into glacial ice, it seals tiny atmospheric air bubbles that preserve greenhouse gases like CO2 and CH4 from thousands of years ago.',
    },
    {
      question: 'What is the name of the freshwater lake that supplies potable water to India’s Maitri Station?',
      options: ['Lake Vostok', 'Lake Zub', 'Lake Priyadarshini', 'Lake Baikal'],
      correct: 2,
      explanation:
        'Lake Priyadarshini is a freshwater proglacial lake in the Schirmacher Oasis that supplies Maitri Station and is studied for unique microbial mats.',
    },
    {
      question: 'At which Arctic location is India’s research base "Himadri" situated?',
      options: ['Ny-Ålesund, Svalbard', 'Nuuk, Greenland', 'Reykjavik, Iceland', 'Murmansk, Russia'],
      correct: 0,
      explanation:
        'Himadri is located in the international research settlement of Ny-Ålesund in Svalbard, Norway (78°55′N).',
    },
    {
      question: 'What unit is universally used to measure total column ozone in the atmosphere?',
      options: ['Kelvin (K)', 'Dobson Unit (DU)', 'Pascal (Pa)', 'Decibel (dB)'],
      correct: 1,
      explanation:
        'Dobson Units (DU) measure column ozone thickness; normal levels are ~300 DU, while ozone hole levels can drop below 120 DU.',
    },
    {
      question: 'What is the official motto of Penguine?',
      options: [
        'Research once, keep private',
        'Archive once, publish everywhere',
        'Explore without documentation',
        'Science without citations',
      ],
      correct: 1,
      explanation:
        '"Archive once, publish everywhere" captures how every expedition report and dataset is curated, cited, and distributed with editor approval.',
    },
  ];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === quizQuestions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const ContainerTag = isEmbedded ? 'section' : 'div';

  return (
    <ContainerTag
      id={isEmbedded ? 'student-zone' : undefined}
      className={
        isEmbedded
          ? 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/40 scroll-mt-16 text-slate-900'
          : 'min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900'
      }
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header Banner */}
        <div className="card-glacier p-6 sm:p-8 rounded-2xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Polar Science & Academic Outreach</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              {isEmbedded ? 'Student Science Zone & Interactive Quiz' : t('navStudent')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
              Explore polar science explainers, deep ice drilling mechanics, and test your knowledge in the Antarctic Explorer Quiz.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl shrink-0 z-10 flex gap-1 text-xs border border-slate-200">
            <button
              onClick={() => setActiveTab('explainers')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explainers'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Science Explainers (3)
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Polar Science Quiz (1)
            </button>
          </div>
        </div>

        {/* TAB 1: 3 Explainers */}
        {activeTab === 'explainers' && (
          <div className="space-y-8">
            {/* Explainer Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {explainers.map((exp, idx) => (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExplainer(idx)}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 border ${
                    selectedExplainer === idx
                      ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <span className="text-[10px] text-blue-600 font-bold uppercase block mb-1">
                    Explainer 0{idx + 1}
                  </span>
                  <h3 className="font-heading font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
                    {exp.title}
                  </h3>
                </button>
              ))}
            </div>

            {/* Active Explainer Showcase */}
            {explainers[selectedExplainer] && (
              <div className="card-glacier overflow-hidden border border-slate-200 shadow-sm">
                <div className="h-64 sm:h-80 w-full overflow-hidden relative">
                  <img
                    src={explainers[selectedExplainer].image}
                    alt={explainers[selectedExplainer].title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/glacier-mountains-sea.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <span className="text-xs text-blue-300 uppercase tracking-wider mb-2 font-bold">
                      Deep Dive Concept • Explainer 0{selectedExplainer + 1}
                    </span>
                    <h2 className="font-heading font-extrabold text-xl sm:text-3xl text-white mb-2 leading-tight">
                      {explainers[selectedExplainer].title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium">
                      {explainers[selectedExplainer].subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Lead Summary */}
                  <div className="card-glacier p-5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
                    {explainers[selectedExplainer].summary}
                  </div>

                  {/* Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {explainers[selectedExplainer].sections.map((sec, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-xl card-glacier border border-slate-200 space-y-2"
                      >
                        <h4 className="font-heading font-extrabold text-sm text-blue-900">
                          {sec.heading}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {sec.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer call to action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      National Centre for Polar and Ocean Research (NCPOR) Educational Outreach
                    </span>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                    >
                      <span>Take the Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Polar Quiz */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto">
            {!quizFinished ? (
              <div className="card-glacier p-6 sm:p-8 border border-slate-200 shadow-sm">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="font-semibold">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">Score: {score}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 p-0.5 border border-slate-200">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Question */}
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 mb-6 leading-relaxed">
                  {quizQuestions[currentQuestion].question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {quizQuestions[currentQuestion].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === quizQuestions[currentQuestion].correct;

                    let btnClass = 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:shadow-xs hover:bg-slate-50';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-50 border-rose-300 text-rose-950 font-medium line-through shadow-xs';
                      } else {
                        btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-blue-50 border-blue-500 text-blue-950 font-bold ring-1 ring-blue-500/30 shadow-xs';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm border transition-all flex items-center justify-between shadow-xs ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-800 leading-relaxed mb-6 font-sans shadow-xs">
                    <span className="font-bold text-blue-900">Scientific Context: </span>
                    {quizQuestions[currentQuestion].explanation}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-glacier-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                    >
                      <span>
                        {currentQuestion + 1 < quizQuestions.length
                          ? 'Next Question →'
                          : 'View Certificate Results'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Finished: Certificate View */
              <div className="card-glacier p-8 sm:p-10 text-center space-y-6 border border-slate-200 shadow-md">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>

                <div>
                  <span className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                    National Polar Science Examination Certificate
                  </span>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
                    Antarctic Explorer Badge Earned!
                  </h2>
                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    Final Score: <span className="text-emerald-700 font-extrabold text-sm">{score} / {quizQuestions.length}</span> (
                    {Math.round((score / quizQuestions.length) * 100)}% Proficiency)
                  </p>
                </div>

                {/* Commemorative Credential Card */}
                <div className="p-6 rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white text-slate-900 space-y-3 max-w-md mx-auto text-left shadow-sm relative overflow-hidden">
                  <div className="text-[10px] text-blue-700 uppercase font-bold tracking-wider">Awarded By:</div>
                  <div className="text-xs font-extrabold text-slate-900">
                    National Polar Data Archive & Ministry of Earth Sciences
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    Recognizing successful completion of the Polar Science Knowledge Challenge.
                  </div>
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-blue-100 font-semibold flex justify-between items-center">
                    <span className="text-emerald-700 font-bold">STATUS: VERIFIED</span>
                    <span className="font-mono text-slate-600">POLAR-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-3 pt-4">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('explainers')}
                    className="btn-glacier-primary px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Read More Explainers
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ContainerTag>
  );
}
