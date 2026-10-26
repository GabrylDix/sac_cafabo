<div class="card sac-import-presentaciones">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h2 class="card-title sac-page-title">Importar presentación</h2>
            <p class="sac-page-description">Seleccione el convenio y el período al que corresponde el archivo Excel.</p>
        </div>
    </div>

    <div class="card-body p-3 p-md-4">
        <form id="formImport_nuevaPresent" class="needs-validation" autocomplete="off" novalidate>
            <section class="mb-4" aria-labelledby="importConvenioTitle">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="sac-section-icon" aria-hidden="true"><i class="bi bi-building"></i></span>
                    <h3 id="importConvenioTitle" class="h6 mb-0">Convenio</h3>
                </div>
                <div class="row g-3">
                    <div class="col-12 col-lg-6">
                        <label for="convenio_pres_select" class="form-label">Convenio <span class="text-danger" aria-hidden="true">*</span></label>
                        <select class="form-select" id="convenio_pres_select" aria-describedby="convenioHelp" required>
                            <option value="">Seleccione un convenio</option>
                        </select>
                        <div class="invalid-feedback">Seleccione un convenio.</div>
                        <div id="convenioHelp" class="form-text" role="status">Escriba el nombre o código para buscar un convenio.</div>
                    </div>
                </div>
            </section>

            <section class="border-top pt-4 mb-4" aria-labelledby="importPeriodoTitle">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="sac-section-icon" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                    <h3 id="importPeriodoTitle" class="h6 mb-0">Período de presentación</h3>
                </div>
                <div class="row g-3">
                    <div class="col-12 col-md-4">
                        <label for="periodo_pres_select" class="form-label">Tipo de período <span class="text-danger" aria-hidden="true">*</span></label>
                        <select class="form-select" id="periodo_pres_select" aria-describedby="periodoHelp" required disabled>
                            <option value="">Seleccione primero un convenio</option>
                        </select>
                        <div class="invalid-feedback">Seleccione un período.</div>
                        <div id="periodoHelp" class="form-text" role="status">Se determina según el convenio seleccionado.</div>
                    </div>
                    <div class="col-12 col-md-4">
                        <label for="mes_pres_select" class="form-label">Mes <span class="text-danger" aria-hidden="true">*</span></label>
                        <select class="form-select" id="mes_pres_select" required>
                            <option value="" disabled selected>Seleccione un mes</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        <div class="invalid-feedback">Seleccione un mes.</div>
                    </div>
                    <div class="col-12 col-md-4">
                        <label for="anio_pres_select" class="form-label">Año <span class="text-danger" aria-hidden="true">*</span></label>
                        <select class="form-select" id="anio_pres_select" required></select>
                        <div class="invalid-feedback">Seleccione un año.</div>
                    </div>
                </div>
            </section>

            <section class="border-top pt-4 mb-4" aria-labelledby="importArchivoTitle">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="sac-section-icon" aria-hidden="true"><i class="bi bi-file-earmark-spreadsheet"></i></span>
                    <h3 id="importArchivoTitle" class="h6 mb-0">Archivo de presentación</h3>
                </div>
                <div class="sac-import-upload" id="fileUploadArea">
                    <input type="file" id="fileInput_pres" class="visually-hidden" accept=".xls,.xlsx" aria-describedby="fileUploadHelp fileError">
                    <label for="fileInput_pres" class="sac-import-upload__label d-block text-center p-3 p-md-4 mb-0">
                        <i class="bi bi-cloud-arrow-up fs-3 d-block mb-2" aria-hidden="true"></i>
                        <span class="fw-semibold d-block">Seleccione un archivo</span>
                        <span class="small text-muted d-block">o arrástrelo aquí</span>
                    </label>
                </div>
                <p id="fileUploadHelp" class="form-text mb-0">Archivos XLS o XLSX de hasta 10 MB. Verifique el período antes de importar.</p>
                <div id="fileError" class="text-danger small mt-2 d-none" role="alert"></div>

                <div id="selectedFileDisplay" class="sac-import-file d-none p-3 mt-3 rounded border">
                    <div class="d-flex align-items-center gap-3">
                        <i class="bi bi-file-earmark-spreadsheet fs-4 flex-shrink-0" aria-hidden="true"></i>
                        <div class="flex-grow-1 sac-import-file__name">
                            <p id="fileName" class="fw-medium mb-0 text-break"></p>
                            <p id="fileSize_pres" class="small text-muted mb-0"></p>
                        </div>
                        <button type="button" id="removeFile_pres" class="btn btn-outline-secondary btn-sm flex-shrink-0" aria-label="Quitar archivo seleccionado">Quitar</button>
                    </div>
                </div>
            </section>

            <div class="border-top pt-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                <p id="validationAlert" class="small text-muted mb-0" role="status" aria-live="polite"></p>
                <button type="submit" class="btn sac-btn-primary" id="btnGuardar_nuevaPresent" disabled>
                    <span id="importBtnText"><i class="bi bi-cloud-upload" aria-hidden="true"></i> Importar presentación</span>
                </button>
            </div>
        </form>
    </div>
</div>

<div id="validationAlertTabla" class="card mt-4 d-none" aria-labelledby="erroresImportTitle">
    <div class="card-header sac-page-header">
        <div class="sac-page-heading__text">
            <h2 id="erroresImportTitle" class="card-title h6 mb-1" tabindex="-1"><i class="bi bi-exclamation-circle text-danger me-2" aria-hidden="true"></i>Errores del archivo</h2>
            <p class="sac-page-description">Revise los registros indicados, corrija el Excel y vuelva a importarlo.</p>
        </div>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table id="datatable_errorFile_pres" class="table table-sm align-middle w-100 sac-asiento-table sac-asiento-detail-table">
                <thead><tr></tr></thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
