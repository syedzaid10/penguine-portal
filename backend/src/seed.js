import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

// Models
import User from './models/User.js';
import Document from './models/Document.js';
import Dataset from './models/Dataset.js';
import Media from './models/Media.js';
import Activity from './models/Activity.js';
import Story from './models/Story.js';
import Chunk from './models/Chunk.js';
import AuditLog from './models/AuditLog.js';
import GeneratedContent from './models/GeneratedContent.js';

import { splitTextIntoChunks } from './services/textExtractor.js';
import { getEmbedding } from './services/aiService.js';

dotenv.config();

export async function runSeed(shouldDisconnect = true) {
  console.log('🌱 Starting Penguine Database Seed Process...');
  if (shouldDisconnect) {
    await connectDB();
  }

  // Clear existing data
  console.log('🧹 Purging existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Document.deleteMany({}),
    Dataset.deleteMany({}),
    Media.deleteMany({}),
    Activity.deleteMany({}),
    Story.deleteMany({}),
    Chunk.deleteMany({}),
    AuditLog.deleteMany({}),
    GeneratedContent.deleteMany({}),
  ]);

  // 1. Create Users
  console.log('👤 Creating role-based accounts...');
  const salt = await bcrypt.genSalt(10);
  const passwordHashAdmin = await bcrypt.hash('Admin@123', salt);
  const passwordHashEditor = await bcrypt.hash('Editor@123', salt);
  const passwordHashScientist = await bcrypt.hash('Scientist@123', salt);
  const passwordHashVisitor = await bcrypt.hash('Visitor@123', salt);

  const admin = await User.create({
    name: 'Dr. Rameshwar Sharma',
    email: 'admin@penguine.gov.in',
    passwordHash: passwordHashAdmin,
    role: 'admin',
    department: 'Ministry of Earth Sciences (MoES) - Director General Desk',
  });

  const editor = await User.create({
    name: 'Priya Narayanan',
    email: 'editor@penguine.gov.in',
    passwordHash: passwordHashEditor,
    role: 'editor',
    department: 'NCPOR Editorial & Science Communication Bureau',
  });

  const scientist = await User.create({
    name: 'Dr. Ananya Sen',
    email: 'scientist@penguine.gov.in',
    passwordHash: passwordHashScientist,
    role: 'scientist',
    department: 'Cryosphere & Atmospheric Sciences Division, NCPOR',
  });

  const visitor = await User.create({
    name: 'Aarav Mehta',
    email: 'visitor@penguine.gov.in',
    passwordHash: passwordHashVisitor,
    role: 'public',
    department: 'Delhi University, Polar Geophysics Scholar',
  });

  console.log('✅ Created 4 users (Admin, Editor, Scientist, Visitor).');

  // 2. Documents & Publications
  console.log('📄 Creating 16 authentic Indian polar research documents...');

  const docsData = [
    {
      title: '40th Indian Scientific Expedition to Antarctica: Glaciological Monitoring at Bharati & Maitri',
      summary: 'Comprehensive glaciological observations on ice shelf mass balance, grounding line migration, and ablation rates across the Schirmacher Oasis and Larsemann Hills sectors.',
      type: 'report',
      station: 'Maitri',
      topicTags: ['Glaciology', 'Mass Balance', 'Ice Shelf', 'Antarctica'],
      year: 2021,
      authorName: 'Dr. M. Ravichandran, Dr. S. K. Singh',
      extractedText: 'The 40th Indian Scientific Expedition to Antarctica marked four decades of uninterrupted Indian scientific presence on the icy continent. Field observations conducted along the Schirmacher Oasis (Maitri) and Larsemann Hills (Bharati) recorded ice velocity vectors ranging between 4.2 to 8.7 meters per annum. GPS stake networks demonstrated a net annual surface mass balance deficit of -12.4 cm water equivalent along coastal moraines. Subsurface radar sounding revealed average ice thicknesses of 180 to 240 meters near the Maitri freshwater Priyadarshini lake catchment.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Atmospheric Black Carbon & Aerosol Optical Depth Measurements at Himadri, Ny-Ålesund, Arctic',
      summary: 'Continuous monitoring of carbonaceous aerosols, optical thickness, and radiative forcing in the high Arctic fjord environment of Kongsfjorden from India’s Arctic station Himadri.',
      type: 'publication',
      station: 'Himadri',
      topicTags: ['Atmospheric Science', 'Black Carbon', 'Arctic Warming', 'Aerosols'],
      year: 2022,
      authorName: 'Dr. C. G. Deshpande, NCPOR Atmospheric Physics Group',
      extractedText: 'Continuous aerosol measurements were acquired at Himadri Station, Ny-Ålesund, Svalbard (78°55′N, 11°56′E) utilizing a 7-wavelength Aethalometer. Average equivalent Black Carbon (eBC) concentrations hovered around 22.4 ng/m³ during the Arctic spring haze period, exhibiting episodic spikes up to 98 ng/m³ driven by long-range Eurasian biomass combustion plumes. Radiative forcing computations indicate a positive surface heating contribution of +0.38 W/m² on melting snowpacks, accelerating albedo decline across Kongsfjorden glaciers.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Long-term Fjord Dynamics in Kongsfjorden using IndARC Mooring Observations',
      summary: 'Hydrographic and biological variability across the Arctic water column captured by India’s multi-sensor subsurface moored observatory IndARC.',
      type: 'publication',
      station: 'IndARC',
      topicTags: ['Oceanography', 'IndARC', 'Fjord Hydrography', 'Arctic'],
      year: 2023,
      authorName: 'Dr. K. P. Krishnan, Ocean Sciences Group',
      extractedText: 'India’s IndARC mooring, deployed at 192 meters depth in Kongsfjorden fjord, Svalbard, provides round-the-clock hydrographic telemetry. The sensor string recorded unprecedented warm Atlantic Water (AW) intrusions during late autumn, with temperature anomalies exceeding +1.8°C above historical 10-year medians. Salinity profiles demonstrated intense halocline shoaling, directly reducing winter fast-ice formation. IndARC acoustic doppler current profilers (ADCP) tracked zooplankton diel vertical migration synchronized with the polar night solar azimuth.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Bedrock Topography and Ice Thickness Measurements across Schirmacher Oasis',
      summary: 'Deep ground penetrating radar (GPR) sounding survey detailing subglacial bedrock topography, ice thickness distributions, and drainage pathways in Dronning Maud Land.',
      type: 'report',
      station: 'Maitri',
      topicTags: ['Geophysics', 'Radar Sounding', 'Ice Thickness', 'Subglacial'],
      year: 2020,
      authorName: 'Survey of India & NCPOR Joint Team',
      extractedText: 'Ground penetrating radar transects spanning 140 linear kilometers across Schirmacher Oasis revealed complex subglacial topography with ice thickness varying from 40 meters on nunatak flanks to 390 meters along the continental ice sheet border. Three prominent subglacial channels sloping north toward the Nivlisen ice shelf were mapped. Bedrock reflectors indicated granulite facies basement gneiss dissected by dolerite dyke swarms.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Stratospheric Ozone Depletion & Recovery Trends over Maitri Station, Antarctica (1990–2020)',
      summary: 'Thirty-year analysis of ozonesonde profiles and Dobson spectrophotometer observations recording Antarctic spring ozone hole dynamics.',
      type: 'publication',
      station: 'Maitri',
      topicTags: ['Ozone Sonde', 'Atmospheric Science', 'Polar Vortex', 'Climate'],
      year: 2021,
      authorName: 'India Meteorological Department (IMD) Polar Cell',
      extractedText: 'Regular electrochemical concentration cell (ECC) ozonesonde ascents launched weekly from Maitri station documented the onset and deepening of the polar ozone hole each September. Minimum total column ozone reached 118 Dobson Units (DU) during historical peak depletion years. However, data between 2015 and 2020 reveals a statistically significant healing rate of +1.4 DU/year in the 14-21 km altitude layer, consistent with the Montreal Protocol chlorofluorocarbon phase-down.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Paleoclimate Reconstruction from Schirmacher Oasis Lake Sediments',
      summary: 'Multi-proxy sediment core geochemistry from Priyadarshini and Zub lakes revealing Holocene climatic fluctuations and ice margin retreats.',
      type: 'publication',
      station: 'Maitri',
      topicTags: ['Paleoclimate', 'Lake Sediments', 'Holocene', 'Geochemistry'],
      year: 2019,
      authorName: 'Dr. Rahul Mohan, Paleoclimatology Lab',
      extractedText: 'Sediment cores retrieved from proglacial Lake Priyadarshini at Maitri station yielded diatom assemblages and biogenic silica profiles spanning 8,400 calibrated years before present. An abrupt warming phase corresponding to the mid-Holocene climatic optimum (6,200 to 4,500 yr BP) was evidenced by blooms of Navicula cryptocephala and depleted carbon isotope ratios, reflecting increased meltwater influx and nutrient enrichment.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Dakshin Gangotri Historical Expedition Logbook & Decommissioning Archive (1983-1990)',
      summary: 'Official engineering and scientific logbooks from India’s first permanent Antarctic research station Dakshin Gangotri on the ice shelf.',
      type: 'report',
      station: 'Dakshin Gangotri',
      topicTags: ['History', 'First Expedition', 'Ice Shelf', 'Dakshin Gangotri'],
      year: 1990,
      authorName: 'Late Dr. S. Z. Qasim and Founding Antarctic Pioneers',
      extractedText: 'Dakshin Gangotri was established during the 3rd Indian Antarctic Expedition in 1983-84 on the ice shelf at 70°05′S, 12°00′E. Designed as a double-storied timber structure, the station supported six winter-over teams conducting pioneer geomagnetic, meteorological, and glaciological investigations. Due to continuous snow accumulation exceeding 1.2 meters annually, the station was decommissioned in 1990 and designated an Antarctic Historic Monument and Site (HSM 44).',
      status: 'Published',
      createdBy: admin._id,
    },
    {
      title: 'Southern Ocean Biogeochemistry and Carbon Flux during Austral Summer',
      summary: 'Shipborne underway sampling of pCO2, dissolved inorganic carbon, and nitrate uptake between 40°S and 65°S aboard ORV Sagar Kanya and Marion Dufresne.',
      type: 'publication',
      station: 'Southern Ocean',
      topicTags: ['Oceanography', 'Carbon Flux', 'Southern Ocean', 'Biogeochemistry'],
      year: 2022,
      authorName: 'Southern Ocean Expedition Science Team',
      extractedText: 'The Southern Ocean acts as a disproportionate planetary sink for anthropogenic carbon dioxide. Cruise transects traversing the Subtropical Front, Subantarctic Front, and Polar Front mapped sea-air delta pCO2 ranging between -45 to +18 microatmospheres. Iron fertilization from meltwater plumes off the Antarctic Peninsula triggered massive phytoplankton blooms dominated by Fragilariopsis kerguelensis, boosting particulate organic carbon export to depth.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'UV-B Radiation Variations and Phytoplankton Stress in Larsemann Hills Coastal Waters',
      summary: 'Field radiometric measurements of spectral UV irradiance and biological weighting factors affecting coastal marine ecosystems near Bharati Station.',
      type: 'report',
      station: 'Bharati',
      topicTags: ['UV Radiation', 'Marine Biology', 'Larsemann Hills', 'Bharati'],
      year: 2023,
      authorName: 'Bharati Biological Field Station',
      extractedText: 'Surface spectral UV-B (280-320 nm) irradiance measured at Bharati Station reached peak values of 1.84 W/m² during late December solstice conditions. Incubated coastal microalgae exhibited photosynthetic quantum yield depression of up to 34% under cloudless sky exposures. Synthesis of photoprotective mycosporine-like amino acids (MAAs) was confirmed as the primary cellular survival mechanism.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Psychrophilic Bacterial Diversity and Antimicrobial Enzymes from Antarctic Moss Mats',
      summary: 'Isolation, genome sequencing, and cold-active enzyme characterization of novel bacterial strains sampled around Maitri and Bharati nunataks.',
      type: 'publication',
      station: 'Bharati',
      topicTags: ['Microbiology', 'Biodiversity', 'Biotechnology', 'Antarctica'],
      year: 2023,
      authorName: 'Center for Cellular & Molecular Biology & NCPOR',
      extractedText: 'Ten novel psychrotolerant bacterial species belonging to Arthrobacter, Psychrobacter, and Flavobacterium genera were isolated from Bryum pseudotriquetrum moss cushions near Bharati Station. The isolates produce cold-adapted extracellular proteases and lipases retaining over 65% catalytic activity at 4°C. Genomic analysis identified cold-shock proteins (CspA) and membrane desaturases critical for survival in sub-zero polar soils.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Geomagnetic Pulsations and Magnetospheric Dynamics Observed at Maitri Station',
      summary: 'Fluxgate and search-coil magnetometer observations recording Pc3-Pc5 continuous pulsations and auroral electrojet indices in Queen Maud Land.',
      type: 'report',
      station: 'Maitri',
      topicTags: ['Space Weather', 'Geomagnetism', 'Auroral Physics', 'Maitri'],
      year: 2022,
      authorName: 'Indian Institute of Geomagnetism (IIG)',
      extractedText: 'Maitri Station is ideally situated in the auroral oval footprint (L-value ~4.8), providing an unshielded window into solar wind-magnetosphere interactions. Magnetometer traces registered intense substorm expansions with horizontal component drops exceeding 850 nT during CME impact events. Concurrent all-sky auroral imager records confirmed discrete green line (557.7 nm) curtains and pulsating aurora during midnight sectors.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Permafrost Active Layer Thermal Dynamics at Ny-Ålesund, Arctic',
      summary: 'Deep borehole temperature sensor records evaluating permafrost warming and active layer thickness variations around Himadri Station, Svalbard.',
      type: 'publication',
      station: 'Himadri',
      topicTags: ['Permafrost', 'Active Layer', 'Arctic', 'Cryosphere'],
      year: 2021,
      authorName: 'Dr. H. S. Negi and Indo-Norwegian Polar Consortium',
      extractedText: 'Thermal sensors installed in a 10-meter deep permafrost borehole at Ny-Ålesund documented a mean annual ground temperature increase of +0.12°C/year since 2012. The active layer thaw depth reached a record 96 cm during the warm August 2020 anomaly. Accelerated permafrost thaw threatens coastal infrastructure and promotes methane liberation from coastal tundra wetlands.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Acoustic Biomass Estimation of Antarctic Krill (Euphausia superba) in Prydz Bay',
      summary: 'Multi-frequency hydroacoustic surveys quantifying krill swarm distribution and recruitment biomass in the coastal waters off Bharati Station.',
      type: 'report',
      station: 'Bharati',
      topicTags: ['Marine Biology', 'Krill', 'Acoustics', 'Prydz Bay'],
      year: 2020,
      authorName: 'Fisheries Survey of India & NCPOR Marine Team',
      extractedText: 'Simrad EK80 echosounder transects across Prydz Bay mapped dense krill swarms concentrated between 30 and 110 meters depth along the continental shelf edge. Mean acoustic volume backscattering strength (Sv) reached -58 dB. Krill mean length was 44.2 mm, indicating robust recruitment from under-ice nursery grounds.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: '30-Year Meteorological Climatology and Extreme Weather Normals at Maitri (1990-2020)',
      summary: 'Statistical summary of surface temperature, blizzards, katabatic winds, and pressure records collected continuously by India Meteorological Department.',
      type: 'report',
      station: 'Maitri',
      topicTags: ['Meteorology', 'Climatology', 'Extreme Weather', 'Maitri'],
      year: 2021,
      authorName: 'IMD Polar Cell',
      extractedText: 'Continuous 30-year observations establish the mean annual temperature at Maitri as -9.8°C, with an absolute minimum of -38.2°C recorded in July 1997 and maximum of +9.8°C in January 2020. Severe blizzard events occur on average 28 times per year, with peak gust velocities reaching 112 knots during winter katabatic windstorms originating from the Polar Plateau.',
      status: 'Published',
      createdBy: scientist._id,
    },
    {
      title: 'Preliminary Glacio-chemical Reconnaissance for Deep Ice Core Drilling in Central Dronning Maud Land',
      summary: 'Ice radar and shallow firn core analysis identifying optimal high-elevation drill sites for acquiring a 100,000-year paleoclimate record.',
      type: 'report',
      station: 'Maitri',
      topicTags: ['Ice Core', 'Deep Drilling', 'Paleoclimate', 'Glaciology'],
      year: 2024,
      authorName: 'Dr. Thamban Meloth, NCPOR Ice Core Lab',
      extractedText: 'Site reconnaissance at 3,100 meters elevation in central Dronning Maud Land identified undisturbed ice thickness of 2,750 meters with horizontal bedrock topography and negligible basal melting. Shallow firn cores displayed distinct annual layer markers in electrical conductivity (ECM) and oxygen isotope delta-18O. This site is designated for India’s proposed 3,000-meter deep ice core drilling project.',
      status: 'Draft',
      createdBy: scientist._id,
    },
    {
      title: 'Microplastic Contamination in Arctic Snow and Fjord Surface Waters near Himadri',
      summary: 'First quantitative assessment of airborne microplastic deposition and marine microplastic debris in the pristine Kongsfjorden ecosystem.',
      type: 'publication',
      station: 'Himadri',
      topicTags: ['Pollution', 'Microplastics', 'Arctic', 'Marine Ecology'],
      year: 2024,
      authorName: 'Dr. Neelu Singh and Polar Environmental Lab',
      extractedText: 'Fresh surface snow samples collected within a 5 km radius of Himadri station revealed microplastic fiber counts averaging 18 particles per liter of meltwater, predominantly polyethylene terephthalate (PET) and polyamide. Long-range atmospheric transport and maritime cruise traffic were identified as primary vector sources.',
      status: 'In review',
      createdBy: scientist._id,
    },
  ];

  const createdDocs = [];
  for (const docInfo of docsData) {
    const doc = await Document.create(docInfo);
    createdDocs.push(doc);

    // Create chunks and embeddings
    const textToChunk = `${doc.title}\n${doc.summary}\n${doc.extractedText}`;
    const chunks = splitTextIntoChunks(textToChunk, 260, 40);

    for (let i = 0; i < chunks.length; i++) {
      const emb = await getEmbedding(chunks[i].text);
      await Chunk.create({
        documentId: doc._id,
        chunkIndex: i,
        text: chunks[i].text,
        embedding: emb,
        metadata: {
          title: doc.title,
          station: doc.station,
          year: doc.year,
          type: doc.type,
        },
      });
    }
  }

  console.log(`✅ Indexed ${createdDocs.length} documents with semantic RAG chunks.`);

  // 3. Datasets (CSV datasets with interactive charts)
  console.log('📊 Creating 4 telemetry and scientific CSV datasets with Recharts configurations...');

  // Dataset 1: Maitri AWS Hourly Temperature & Wind
  const maitriAwsDoc = await Document.create({
    title: 'Maitri Station Automatic Weather Station (AWS) Hourly Telemetry',
    summary: 'High-frequency surface meteorological observations recorded hourly at Maitri Station (Schirmacher Oasis, Antarctica), including temperature, wind speed, pressure, and relative humidity.',
    type: 'dataset',
    station: 'Maitri',
    topicTags: ['AWS', 'Meteorology', 'Hourly Data', 'Temperature', 'Antarctica'],
    year: 2024,
    authorName: 'IMD & NCPOR Telemetry Division',
    extractedText: 'Hourly surface weather parameters recorded at AWS Maitri (70°45′58″S, 11°44′09″E, elevation 117m). Parameters: timestamp, temp_c, wind_speed_kts, wind_gust_kts, pressure_hpa, humidity_pct.',
    status: 'Published',
    createdBy: scientist._id,
    publishedAt: new Date(),
  });

  const maitriRows = [
    { time: '00:00', temp_c: -19.4, wind_speed_kts: 18.2, pressure_hpa: 986.2, humidity_pct: 64 },
    { time: '02:00', temp_c: -20.1, wind_speed_kts: 19.5, pressure_hpa: 985.8, humidity_pct: 66 },
    { time: '04:00', temp_c: -21.3, wind_speed_kts: 22.0, pressure_hpa: 985.1, humidity_pct: 68 },
    { time: '06:00', temp_c: -20.8, wind_speed_kts: 24.1, pressure_hpa: 984.7, humidity_pct: 67 },
    { time: '08:00', temp_c: -18.6, wind_speed_kts: 26.4, pressure_hpa: 984.2, humidity_pct: 63 },
    { time: '10:00', temp_c: -16.2, wind_speed_kts: 28.0, pressure_hpa: 983.8, humidity_pct: 60 },
    { time: '12:00', temp_c: -14.5, wind_speed_kts: 27.2, pressure_hpa: 983.5, humidity_pct: 58 },
    { time: '14:00', temp_c: -15.1, wind_speed_kts: 25.8, pressure_hpa: 984.0, humidity_pct: 59 },
    { time: '16:00', temp_c: -16.9, wind_speed_kts: 23.4, pressure_hpa: 984.6, humidity_pct: 62 },
    { time: '18:00', temp_c: -18.2, wind_speed_kts: 21.0, pressure_hpa: 985.3, humidity_pct: 64 },
    { time: '20:00', temp_c: -19.0, wind_speed_kts: 19.8, pressure_hpa: 985.9, humidity_pct: 65 },
    { time: '22:00', temp_c: -19.8, wind_speed_kts: 18.9, pressure_hpa: 986.4, humidity_pct: 66 },
  ];

  await Dataset.create({
    documentId: maitriAwsDoc._id,
    instrument: 'Vaisala Milos 520 AWS Suite',
    units: 'Temperature (°C), Wind (knots), Pressure (hPa)',
    licence: 'Open Government Data (OGD) India / CC-BY 4.0',
    columnHeaders: ['time', 'temp_c', 'wind_speed_kts', 'pressure_hpa', 'humidity_pct'],
    previewRows: maitriRows,
    chartConfig: {
      xAxis: 'time',
      yAxis: ['temp_c', 'wind_speed_kts'],
      type: 'line',
      unitLabel: 'Temp (°C) / Wind (kts)',
    },
  });

  // Dataset 2: Bharati Solar UV Radiation & Solar Flux
  const bharatiUvDoc = await Document.create({
    title: 'Bharati Station Surface Solar Radiation & UV Flux Monitoring',
    summary: 'Diurnal solar radiation irradiance, UV-A, UV-B indices, and columnar aerosol optical depth measured during polar summer at Larsemann Hills, East Antarctica.',
    type: 'dataset',
    station: 'Bharati',
    topicTags: ['Solar Radiation', 'UV Index', 'Larsemann Hills', 'Energy Balance'],
    year: 2024,
    authorName: 'Bharati Solar Physics Laboratory',
    extractedText: 'Diurnal solar radiometric profile at Bharati Station (69°24′28″S, 76°11′14″E). Metrics: timestamp, solar_w_m2, uv_b_mw_m2, uv_index, cloud_fraction.',
    status: 'Published',
    createdBy: scientist._id,
    publishedAt: new Date(),
  });

  const bharatiRows = [
    { time: '00:00', solar_w_m2: 45, uv_b_mw_m2: 8.2, uv_index: 0.8 },
    { time: '02:00', solar_w_m2: 80, uv_b_mw_m2: 14.5, uv_index: 1.4 },
    { time: '04:00', solar_w_m2: 185, uv_b_mw_m2: 32.1, uv_index: 2.8 },
    { time: '06:00', solar_w_m2: 320, uv_b_mw_m2: 58.0, uv_index: 4.5 },
    { time: '08:00', solar_w_m2: 480, uv_b_mw_m2: 86.4, uv_index: 6.2 },
    { time: '10:00', solar_w_m2: 610, uv_b_mw_m2: 112.0, uv_index: 7.9 },
    { time: '12:00', solar_w_m2: 685, uv_b_mw_m2: 128.5, uv_index: 8.6 },
    { time: '14:00', solar_w_m2: 620, uv_b_mw_m2: 114.2, uv_index: 8.0 },
    { time: '16:00', solar_w_m2: 470, uv_b_mw_m2: 84.1, uv_index: 6.1 },
    { time: '18:00', solar_w_m2: 290, uv_b_mw_m2: 52.0, uv_index: 4.1 },
    { time: '20:00', solar_w_m2: 140, uv_b_mw_m2: 25.4, uv_index: 2.2 },
    { time: '22:00', solar_w_m2: 60, uv_b_mw_m2: 10.8, uv_index: 1.0 },
  ];

  await Dataset.create({
    documentId: bharatiUvDoc._id,
    instrument: 'Kipp & Zonen CMP21 Pyranometer & Brewer Spectrophotometer',
    units: 'Solar (W/m²), UV-B (mW/m²), UV Index',
    licence: 'CC-BY 4.0 International',
    columnHeaders: ['time', 'solar_w_m2', 'uv_b_mw_m2', 'uv_index'],
    previewRows: bharatiRows,
    chartConfig: {
      xAxis: 'time',
      yAxis: ['solar_w_m2', 'uv_b_mw_m2'],
      type: 'area',
      unitLabel: 'Solar Irradiance (W/m²)',
    },
  });

  // Dataset 3: IndARC CTD Salinity & Water Temperature Depth Profile
  const indarcCtdDoc = await Document.create({
    title: 'IndARC Subsurface Mooring CTD Water Column Profile in Kongsfjorden',
    summary: 'High-precision depth profile of seawater temperature, salinity, density, and sound velocity acquired across the 0-180m water column in Svalbard Arctic fjord.',
    type: 'dataset',
    station: 'IndARC',
    topicTags: ['CTD', 'Salinity', 'Ocean Temperature', 'IndARC', 'Arctic Ocean'],
    year: 2023,
    authorName: 'NCPOR Arctic Oceanography Group',
    extractedText: 'CTD vertical cast from IndARC Kongsfjorden mooring location (78°59′N, 11°53′E). Parameters: depth_m, temp_c, salinity_psu, density_kg_m3, sound_vel_m_s.',
    status: 'Published',
    createdBy: scientist._id,
    publishedAt: new Date(),
  });

  const indarcRows = [
    { depth_m: 5, temp_c: 2.84, salinity_psu: 33.12, sound_vel_m_s: 1459.2 },
    { depth_m: 20, temp_c: 2.45, salinity_psu: 33.68, sound_vel_m_s: 1458.1 },
    { depth_m: 40, temp_c: 1.82, salinity_psu: 34.21, sound_vel_m_s: 1456.4 },
    { depth_m: 60, temp_c: 1.15, salinity_psu: 34.58, sound_vel_m_s: 1454.8 },
    { depth_m: 80, temp_c: 0.62, salinity_psu: 34.79, sound_vel_m_s: 1453.6 },
    { depth_m: 100, temp_c: -0.12, salinity_psu: 34.88, sound_vel_m_s: 1452.1 },
    { depth_m: 120, temp_c: -0.45, salinity_psu: 34.92, sound_vel_m_s: 1451.6 },
    { depth_m: 140, temp_c: -0.68, salinity_psu: 34.95, sound_vel_m_s: 1451.2 },
    { depth_m: 160, temp_c: -0.74, salinity_psu: 34.97, sound_vel_m_s: 1451.4 },
    { depth_m: 180, temp_c: -0.78, salinity_psu: 34.99, sound_vel_m_s: 1451.8 },
  ];

  await Dataset.create({
    documentId: indarcCtdDoc._id,
    instrument: 'Sea-Bird SBE 19plus V2 SeaCAT CTD Profiler',
    units: 'Depth (m), Temperature (°C), Salinity (PSU), Velocity (m/s)',
    licence: 'Open Government Data (OGD) India',
    columnHeaders: ['depth_m', 'temp_c', 'salinity_psu', 'sound_vel_m_s'],
    previewRows: indarcRows,
    chartConfig: {
      xAxis: 'depth_m',
      yAxis: ['temp_c', 'salinity_psu'],
      type: 'line',
      unitLabel: 'Temp (°C) / Salinity (PSU)',
    },
  });

  // Dataset 4: Antarctic Ice Core Greenhouse Gas & Isotope Records
  const iceCoreDoc = await Document.create({
    title: 'Central Dronning Maud Land Ice Core CO2 & Delta 18-O Proxy Records',
    summary: 'Paleo-atmospheric proxy records extracted from shallow firn and intermediate ice core samples detailing trapped CO2 concentrations and oxygen isotope ratios over the last 2,000 years.',
    type: 'dataset',
    station: 'Maitri',
    topicTags: ['Ice Core', 'CO2 Proxy', 'Delta 18-O', 'Paleoclimate', 'Glaciology'],
    year: 2023,
    authorName: 'National Ice Core Laboratory, Goa',
    extractedText: 'High-resolution greenhouse gas record from 120m ice core drilled inland of Maitri. Parameters: depth_m, age_bp, co2_ppm, ch4_ppb, delta18O_per_mil.',
    status: 'Published',
    createdBy: scientist._id,
    publishedAt: new Date(),
  });

  const iceCoreRows = [
    { depth_m: 10, age_bp: 25, co2_ppm: 382, ch4_ppb: 1780, delta18O_per_mil: -34.2 },
    { depth_m: 25, age_bp: 75, co2_ppm: 318, ch4_ppb: 1120, delta18O_per_mil: -34.8 },
    { depth_m: 40, age_bp: 160, co2_ppm: 288, ch4_ppb: 820, delta18O_per_mil: -35.4 },
    { depth_m: 55, age_bp: 320, co2_ppm: 282, ch4_ppb: 740, delta18O_per_mil: -36.1 },
    { depth_m: 70, age_bp: 580, co2_ppm: 280, ch4_ppb: 725, delta18O_per_mil: -35.8 },
    { depth_m: 85, age_bp: 890, co2_ppm: 281, ch4_ppb: 710, delta18O_per_mil: -35.2 },
    { depth_m: 100, age_bp: 1350, co2_ppm: 279, ch4_ppb: 695, delta18O_per_mil: -35.6 },
    { depth_m: 115, age_bp: 1840, co2_ppm: 278, ch4_ppb: 690, delta18O_per_mil: -35.9 },
  ];

  await Dataset.create({
    documentId: iceCoreDoc._id,
    instrument: 'Continuous Flow Analysis (CFA) & Picarro Cavity Ring-Down Spectrometer',
    units: 'Depth (m), CO2 (ppm), CH4 (ppb), δ18O (‰)',
    licence: 'CC-BY 4.0 International',
    columnHeaders: ['depth_m', 'age_bp', 'co2_ppm', 'ch4_ppb', 'delta18O_per_mil'],
    previewRows: iceCoreRows,
    chartConfig: {
      xAxis: 'depth_m',
      yAxis: ['co2_ppm', 'delta18O_per_mil'],
      type: 'line',
      unitLabel: 'CO2 (ppm) vs Depth',
    },
  });

  console.log('✅ Created 4 Datasets with preview data and charts.');

  // 4. Media (Photos and Videos)
  console.log('🖼️ Creating 18 authentic polar media assets with distinct images, captions and credits...');
  const mediaItems = [
    {
      title: 'Maitri Research Station in Austral Winter',
      caption: 'The main accommodation and laboratory block of Maitri Station illuminated against the polar twilight in Schirmacher Oasis.',
      credit: 'NCPOR / Ministry of Earth Sciences',
      type: 'photo',
      station: 'Maitri',
      year: 2023,
      fileUrl: '/images/polar-station-facility.jpg',
      tags: ['Maitri', 'Station', 'Winter', 'Twilight'],
    },
    {
      title: 'Bharati Station Architectural Pods at Larsemann Hills',
      caption: 'Bharati Station’s futuristic prefabricated container design engineered to withstand winds up to 200 km/h and extreme katabatic storms.',
      credit: 'ISRO / NCPOR Engineering Team',
      type: 'photo',
      station: 'Bharati',
      year: 2022,
      fileUrl: '/images/bharati-station-coastal.jpg',
      tags: ['Bharati', 'Architecture', 'Larsemann Hills'],
    },
    {
      title: 'Himadri Research Base Under Midnight Sun',
      caption: 'India’s Arctic research station Himadri located at Ny-Ålesund, Svalbard, serving as a hub for aerosol and fjord investigations.',
      credit: 'Kings Bay AS / NCPOR Arctic Mission',
      type: 'photo',
      station: 'Himadri',
      year: 2023,
      fileUrl: '/images/himadri-arctic-research-base.jpg',
      tags: ['Himadri', 'Arctic', 'Svalbard', 'Midnight Sun'],
    },
    {
      title: 'IndARC Subsurface Mooring Deployment in Kongsfjorden',
      caption: 'Marine engineers lowering the multi-sensor IndARC mooring array from research vessel Lance into the glacial waters of Kongsfjorden.',
      credit: 'NCPOR Ocean Sciences Division',
      type: 'photo',
      station: 'IndARC',
      year: 2022,
      fileUrl: '/images/icebreaker-pack-ice.jpg',
      tags: ['IndARC', 'Oceanography', 'Mooring', 'Deployment'],
    },
    {
      title: 'Southern Lights (Aurora Australis) over Maitri',
      caption: 'Spectacular geomagnetic aurora curtains photographed by Indian winter-over scientists over Schirmacher Oasis during polar night.',
      credit: 'Indian Institute of Geomagnetism (IIG)',
      type: 'photo',
      station: 'Maitri',
      year: 2023,
      fileUrl: '/images/aurora-station-domes.jpg',
      tags: ['Aurora', 'Space Weather', 'Night', 'Maitri'],
    },
    {
      title: 'Ice Core Extraction at 3,000m Elevation',
      caption: 'Glaciologists inspecting a freshly drilled 10-meter firn core section showing pristine annual deposition laminations.',
      credit: 'National Ice Core Laboratory, Goa',
      type: 'photo',
      station: 'Maitri',
      year: 2024,
      fileUrl: '/images/ice-core-drilling-team.jpg',
      tags: ['Ice Core', 'Glaciology', 'Drilling', 'Science'],
    },
    {
      title: 'Expedition Vessel Traversing Southern Ocean Pack Ice',
      caption: 'Chartered icebreaker vessel MV Vasiliy Golovnin forging a channel through heavy pack ice in Prydz Bay towards Bharati Station.',
      credit: 'NCPOR Logistics & Expedition Operations',
      type: 'photo',
      station: 'Bharati',
      year: 2023,
      fileUrl: '/images/sea-ice-aerial.jpg',
      tags: ['Icebreaker', 'Vessel', 'Pack Ice', 'Prydz Bay'],
    },
    {
      title: 'Adélie Penguin Colony along Larsemann Hills',
      caption: 'Nesting Adélie penguins documented during biological biodiversity census near Haswell Island and Bharati Station.',
      credit: 'Zoological Survey of India (ZSI)',
      type: 'photo',
      station: 'Bharati',
      year: 2023,
      fileUrl: '/images/ice-cave-penguins.jpg',
      tags: ['Wildlife', 'Penguins', 'Biodiversity', 'Antarctica'],
    },
    {
      title: 'Historical Plaque at Dakshin Gangotri Monument',
      caption: 'Commemorative marker at the site of India’s first Antarctic base, preserved as Antarctic Historic Site and Monument No. 44.',
      credit: 'Survey of India Heritage Archives',
      type: 'photo',
      station: 'Dakshin Gangotri',
      year: 2021,
      fileUrl: '/images/polar-field-camp-aerial.jpg',
      tags: ['History', 'Dakshin Gangotri', 'Heritage', 'ATCM'],
    },
    {
      title: 'Kongsfjorden Glacier Calving Front',
      caption: 'Tidewater glacier Kronebreen calving large icebergs into the fjord, tracked by Himadri researchers for sea level rise modeling.',
      credit: 'Norwegian Polar Institute & NCPOR',
      type: 'photo',
      station: 'Himadri',
      year: 2023,
      fileUrl: '/images/glacial-ice-wall-fjord.jpg',
      tags: ['Glacier', 'Calving', 'Arctic', 'Fjord'],
    },
    {
      title: 'CTD Water Sampler Rosette Deployment',
      caption: 'Scientists operating the 24-bottle Niskin rosette to capture pristine deep water samples across the Antarctic Divergence.',
      credit: 'Ministry of Earth Sciences (MoES)',
      type: 'photo',
      station: 'Southern Ocean',
      year: 2022,
      fileUrl: '/images/blue-ice-cavern.jpg',
      tags: ['Oceanography', 'CTD', 'Rosette', 'Sampling'],
    },
    {
      title: 'Lake Priyadarshini Frozen Surface, Schirmacher Oasis',
      caption: 'The perennially cold freshwater lake that supplies potable water to Maitri Station, studied for unique benthic microbial mats.',
      credit: 'Dr. Rahul Mohan / NCPOR',
      type: 'photo',
      station: 'Maitri',
      year: 2023,
      fileUrl: '/images/glacier-reflection.jpg',
      tags: ['Lake', 'Priyadarshini', 'Freshwater', 'Maitri'],
    },
    {
      title: 'Convoy PistenBully Snow Groomers & Field Exploration',
      caption: 'Glaciologists and heavy tracked vehicles traversing deep snow fields on scientific survey routes.',
      credit: 'NCPOR Polar Logistics Bureau',
      type: 'photo',
      station: 'Maitri',
      year: 2023,
      fileUrl: '/images/antarctic-field-exploration.jpg',
      tags: ['Logistics', 'Vehicles', 'Fieldwork', 'Convoy'],
    },
    {
      title: 'Polar Bear Sighting near Ny-Ålesund Fjord (Video)',
      caption: 'High-definition telephoto footage of a mother polar bear and cub foraging along the Kongsfjorden shoreline near Himadri base.',
      credit: 'Himadri Field Crew / Svalbard Wildlife Service',
      type: 'video',
      station: 'Himadri',
      year: 2023,
      fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: '/images/glacier-mountains-sea.jpg',
      tags: ['Wildlife', 'Polar Bear', 'Arctic', 'Video'],
    },
    {
      title: 'Antarctic Blizzard Time-lapse from Maitri Watchtower (Video)',
      caption: 'Catastrophic 80-knot blizzard conditions reducing visibility to under 5 meters over an 18-hour continuous time-lapse.',
      credit: 'IMD Station Meteorologist',
      type: 'video',
      station: 'Maitri',
      year: 2023,
      fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: '/images/polar-bg-main.jpg',
      tags: ['Blizzard', 'Weather', 'Time-lapse', 'Video'],
    },
    {
      title: 'Aerosol Sampling Lab Inside Himadri Station',
      caption: 'Multi-wavelength aethalometers and optical particle counters in the clean laboratory room of Himadri station overlooking glaciers.',
      credit: 'NCPOR Atmospheric Sciences',
      type: 'photo',
      station: 'Himadri',
      year: 2023,
      fileUrl: '/images/polar-glacier-panorama.jpg',
      tags: ['Laboratory', 'Instruments', 'Aerosol', 'Himadri'],
    },
    {
      title: 'Bharati Station Satellite Earth Observation Antenna',
      caption: 'ISRO ground station antenna dome at Bharati transmitting high-speed earth observation data directly to Shadnagar, Hyderabad.',
      credit: 'National Remote Sensing Centre (NRSC) / ISRO',
      type: 'photo',
      station: 'Bharati',
      year: 2022,
      fileUrl: '/images/station-datacenter.jpg',
      tags: ['Satellite', 'ISRO', 'Antenna', 'Bharati'],
    },
    {
      title: 'Emperor Penguin Solitary Survey along Polar Coastline',
      caption: 'High-resolution telemetry observation of Emperor penguins migrating across sea ice shelf near Indian research territory.',
      credit: 'Zoological Survey of India (ZSI)',
      type: 'photo',
      station: 'Bharati',
      year: 2024,
      fileUrl: '/images/solitary-penguin-journey.jpg',
      tags: ['Wildlife', 'Fauna', 'Emperor Penguin', 'Coast'],
    },
  ];

  for (const m of mediaItems) {
    await Media.create({
      ...m,
      status: 'Published',
      createdBy: editor._id,
    });
  }
  console.log(`✅ Created ${mediaItems.length} media items.`);

  // 5. Activities (Timeline of Indian Polar Milestones)
  console.log('📅 Creating 8 historical & modern polar activities timeline...');
  const activities = [
    {
      title: '1st Indian Scientific Expedition to Antarctica Flagged Off',
      description: 'Under the vision of Prime Minister Indira Gandhi and leadership of Dr. S. Z. Qasim, the expedition sailed from Goa aboard MV Polar Circle, making India the first developing nation to land on the icy continent on 9 January 1982.',
      date: '1981-12-06',
      category: 'expedition',
      station: 'Antarctica',
      status: 'Published',
    },
    {
      title: 'Dakshin Gangotri Commissioned as India’s First Base',
      description: 'Constructed in a record time of 60 days on the ice shelf during the 3rd Expedition, establishing permanent year-round Indian scientific monitoring in Queen Maud Land.',
      date: '1983-12-26',
      category: 'event',
      station: 'Dakshin Gangotri',
      status: 'Published',
    },
    {
      title: 'Maitri Station Built in Schirmacher Oasis',
      description: 'India established its second permanent research base Maitri on rocky ice-free terrain, ensuring long-term geologic, atmospheric, and biology studies overlooking Lake Priyadarshini.',
      date: '1989-01-26',
      category: 'expedition',
      station: 'Maitri',
      status: 'Published',
    },
    {
      title: 'Himadri Research Base Opens in Arctic (Ny-Ålesund)',
      description: 'India inaugurated Himadri station in Svalbard, Norway, positioning India among a select group of nations conducting simultaneous bipolar scientific studies.',
      date: '2008-07-02',
      category: 'expedition',
      station: 'Himadri',
      status: 'Published',
    },
    {
      title: 'Bharati Station Commissioned in Larsemann Hills',
      description: 'State-of-the-art third research station commissioned at 69°S in East Antarctica, incorporating energy-efficient cogeneration systems and satellite telemetry links to NRSC Hyderabad.',
      date: '2012-03-18',
      category: 'expedition',
      station: 'Bharati',
      status: 'Published',
    },
    {
      title: 'IndARC Underwater Mooring Successfully Anchored',
      description: 'India’s first multi-sensor subsurface moored observatory IndARC deployed in Kongsfjorden at 192m depth, monitoring Arctic water exchange year-round through polar winter.',
      date: '2014-07-23',
      category: 'event',
      station: 'IndARC',
      status: 'Published',
    },
    {
      title: 'First Year-Round Arctic Wintering from Himadri',
      description: 'NCPOR launched India’s first uninterrupted winter scientific mission at Himadri, recording continuous polar night atmospheric optical depth and fjord chemistry.',
      date: '2023-12-18',
      category: 'announcement',
      station: 'Himadri',
      status: 'Published',
    },
    {
      title: 'Cabinet Approves New Maitri-II Antarctic Research Station',
      description: 'Government of India sanctions construction of modernized, ultra-low carbon Maitri-II station to replace the aging Maitri complex by 2029 with cutting-edge clean laboratories.',
      date: '2024-04-12',
      category: 'announcement',
      station: 'Maitri',
      status: 'Published',
    },
  ];

  for (const act of activities) {
    await Activity.create(act);
  }
  console.log(`✅ Created ${activities.length} activities.`);

  // 6. News Stories & Press Releases
  console.log('📰 Creating 5 featured stories and press releases...');
  const stories = [
    {
      title: 'India Completes 43rd Scientific Expedition to Antarctica with Historic Marine Surveys',
      summary: 'Over 50 scientists from 18 national research institutes return successfully after conducting deep ice radar sounding and Southern Ocean carbon flux mapping.',
      body: 'GOA / NEW DELHI — The 43rd Indian Scientific Expedition to Antarctica (43-ISEA) has concluded its operations, marking significant milestones in glaciology, space weather, and marine genomics. Returning scientists aboard the chartered expedition vessel reported completing over 2,000 kilometers of high-resolution ground penetrating radar transects across the continental ice sheet near Maitri and Bharati stations.\n\nDr. Thamban Meloth, Director of NCPOR, commended the interdisciplinary team for maintaining uninterrupted long-term climate observations under severe katabatic storms. All raw datasets have been indexed in Penguine for public and academic research access.',
      coverImage: '/images/icebreaker-pack-ice.jpg',
      language: 'en',
      category: 'Press Release',
      featured: true,
      status: 'Published',
      author: 'Ministry of Earth Sciences Desk',
      publishedAt: new Date(),
    },
    {
      title: 'भारत ने अंटार्कटिका में 43वें वैज्ञानिक अभियान को सफलतापूर्वक किया संपन्न',
      summary: '18 राष्ट्रीय अनुसंधान संस्थानों के 50 से अधिक वैज्ञानिक बर्फ की मोटाई और दक्षिणी महासागर कार्बन प्रवाह के महत्वपूर्ण आंकड़े लेकर लौटे।',
      body: 'गोवा / नई दिल्ली — अंटार्कटिका में भारत के 43वें वैज्ञानिक अभियान ने अपने सभी निर्धारित लक्ष्यों को सफलतापूर्वक पूरा कर लिया है। राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र (NCPOR) के वैज्ञानिकों ने मैत्री और भारती स्टेशनों के पास 2,000 किलोमीटर से अधिक लंबी ग्राउंड पेनिट्रेटिंग रडार मैपिंग पूरी की है।\n\nपृथ्वी विज्ञान मंत्रालय ने बताया कि एकत्र किए गए आंकड़े भारतीय ध्रुवीय पोर्टल पर शोधकर्ताओं और नीति निर्माताओं के लिए उपलब्ध करा दिए गए हैं।',
      coverImage: '/images/icebreaker-pack-ice.jpg',
      language: 'hi',
      category: 'प्रेस विज्ञप्ति',
      featured: true,
      status: 'Published',
      author: 'ध्रुवीय संपादकीय डेस्क',
      publishedAt: new Date(),
    },
    {
      title: 'IndARC Subsurface Mooring Detects Warm Atlantic Water Surges in the High Arctic',
      summary: 'Continuous 10-year hydrographic observations reveal unprecedented autumn heat fluxes into Kongsfjorden, altering regional sea ice dynamics.',
      body: 'NY-ÅLESUND, SVALBARD — Real-time telemetry retrieved from India’s IndARC mooring observatory indicates that pulses of warm, saline North Atlantic water are penetrating deeper into high Arctic fjords than previously documented.\n\nOceanographers from NCPOR noted that during late October, water temperatures at 100 meters depth reached +1.8°C above seasonal baseline norms. These observations underscore IndARC’s crucial role in diagnosing global teleconnections between Arctic warming and the Indian monsoon system.',
      coverImage: '/images/blue-ice-cavern.jpg',
      language: 'en',
      category: 'Research Milestone',
      featured: false,
      status: 'Published',
      author: 'Dr. K. P. Krishnan, NCPOR',
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
    {
      title: 'Design for New Ultra-Green Maitri-II Station Unveiled in Goa',
      summary: 'Featuring solar-wind hybrid microgrids, zero-effluent discharge, and state-of-the-art clean labs, Maitri-II will safeguard India’s polar future.',
      body: 'PANAJI — NCPOR has unveiled the architectural masterplan for Maitri-II, India’s next-generation Antarctic research base set to rise in the Schirmacher Oasis by 2029.\n\nThe state-of-the-art modular facility will house up to 40 scientists year-round, integrating advanced vacuum sewage recycling, solar photovoltaic skins, and vertical aeroponic green gardens to sustain fresh produce during the 6-month polar night.',
      coverImage: '/images/polar-station-facility.jpg',
      language: 'en',
      category: 'Infrastructure',
      featured: false,
      status: 'Published',
      author: 'NCPOR Media Cell',
      publishedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    },
    {
      title: 'Microplastic Contamination Detected in Pristine Svalbard Snow near Himadri',
      summary: 'New collaborative study highlights how transboundary atmospheric currents carry synthetic polymer fibers into high-latitude Arctic cryosphere.',
      body: 'A peer-reviewed investigation conducted by Indian and European researchers has identified microplastic fibers in newly fallen snow samples around Ny-Ålesund.\n\nUsing micro-Raman spectroscopy, scientists detected polyethylene terephthalate (PET) and nylon particles, indicating that no environment on Earth remains completely immune from global polymer dispersion. The findings were submitted to the Arctic Council Arctic Monitoring and Assessment Programme (AMAP).',
      coverImage: '/images/glacier-reflection.jpg',
      language: 'en',
      category: 'Environment',
      featured: false,
      status: 'Published',
      author: 'Dr. Neelu Singh',
      publishedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000),
    },
  ];

  for (const s of stories) {
    await Story.create(s);
  }
  console.log(`✅ Created ${stories.length} stories.`);

  // 7. Seed Audit Logs
  console.log('📝 Seeding initial audit trail...');
  await AuditLog.create([
    {
      userId: admin._id,
      userName: admin.name,
      userRole: 'admin',
      action: 'CREATE',
      targetType: 'Document',
      targetId: createdDocs[0]._id.toString(),
      targetTitle: createdDocs[0].title,
      comment: 'Initial database seed of National Polar Data Repository archive',
      timestamp: new Date(Date.now() - 86400000 * 2),
    },
    {
      userId: editor._id,
      userName: editor.name,
      userRole: 'editor',
      action: 'STATUS_CHANGE',
      targetType: 'Document',
      targetId: createdDocs[0]._id.toString(),
      targetTitle: createdDocs[0].title,
      oldStatus: 'In review',
      newStatus: 'Published',
      comment: 'Approved after peer review and metadata verification',
      timestamp: new Date(Date.now() - 86400000),
    },
  ]);

  console.log('🎉 Seed completed successfully!');
  if (shouldDisconnect) {
    await disconnectDB();
  }
}

// Allow direct CLI execution: node src/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(() => {
      console.log('✅ Seeding exited cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
