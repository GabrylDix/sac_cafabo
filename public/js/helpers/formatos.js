var Formatos = {
    formatoEntero: function formatoEntero(valor) {
        return this.formatoNumero(valor, 0);
    },

    formatoNumero: function formatoNumero(valor, decimales) {
        var cantidadDecimales = typeof decimales === "number" ? decimales : 2;
        var numero = this.parseNumero(valor);

        return numero.toLocaleString("es-AR", {
            minimumFractionDigits: cantidadDecimales,
            maximumFractionDigits: cantidadDecimales,
        });
    },

    formatoMoneda: function formatoMoneda(valor, simbolo) {
        var prefijo = typeof simbolo === "string" ? simbolo : "$";
        return prefijo + " " + this.formatoNumero(valor, 2);
    },

    formatoMonedaCompacta: function formatoMonedaCompacta(valor, simbolo) {
        var prefijo = typeof simbolo === "string" ? simbolo : "$";
        var monto = this.parseNumero(valor);

        if (monto >= 1000000) {
            return prefijo + " " + this.formatoNumero(monto / 1000000, 1) + " M";
        }

        if (monto >= 1000) {
            return prefijo + " " + this.formatoNumero(monto / 1000, 1) + " K";
        }

        return prefijo + " " + this.formatoNumero(monto, 0);
    },

    formatoMillones: function formatoMillones(valor, simbolo) {
        var prefijo = typeof simbolo === "string" ? simbolo : "$";
        var monto = this.parseNumero(valor);
        return prefijo + " " + this.formatoNumero(monto, 1) + " M";
    },

    formatoMillonesTexto: function formatoMillonesTexto(valor, simbolo) {
        var prefijo = typeof simbolo === "string" ? simbolo : "$";
        var monto = this.parseNumero(valor);
        return prefijo + " " + this.formatoNumero(monto, 1) + " millones";
    },

    formatoPorcentaje: function formatoPorcentaje(valor, decimalesMaximos) {
        var cantidadDecimales = typeof decimalesMaximos === "number" ? decimalesMaximos : 2;
        var numero = Math.min(Math.max(this.parseNumero(valor), 0), 100);

        return (
            numero.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: cantidadDecimales,
            }) + "%"
        );
    },

    parseNumero: function parseNumero(valor) {
        if (valor === null || valor === undefined) {
            return 0;
        }

        var normalizado = String(valor).trim();

        if (!normalizado) {
            return 0;
        }

        normalizado = normalizado.replace(/\$/g, "").replace(/\s/g, "");

        var tieneComa = normalizado.indexOf(",") !== -1;
        var tienePunto = normalizado.indexOf(".") !== -1;

        if (tieneComa && tienePunto) {
            normalizado = normalizado.replace(/\./g, "").replace(/,/g, ".");
        } else if (tieneComa) {
            normalizado = normalizado.replace(/,/g, ".");
        } else if (/^-?\d{1,3}(\.\d{3})+$/.test(normalizado)) {
            normalizado = normalizado.replace(/\./g, "");
        }

        normalizado = normalizado.replace(/[^0-9.-]/g, "");

        var numero = parseFloat(normalizado);
        return Number.isFinite(numero) ? numero : 0;
    },

    mascaraMoneda: function mascaraMoneda(entrada) {
        var valorEntrada = entrada === null || entrada === undefined ? "" : String(entrada);
        var salida = "";
        var aux = "";

        if (valorEntrada.substring(0, 1) === "-") {
            aux = "-";
        }

        var numero = valorEntrada.replace(/\./g, "");
        numero = numero.replace(/,/g, "");
        numero = numero.replace(/-/g, "");
        numero = numero.replace(/^0+(?!$)/, "");

        switch (true) {
            case numero.length > 11: {
                var decimal = numero.substring(numero.length - 2, numero.length);
                var cientos = numero.substring(numero.length - 5, numero.length - 2);
                var miles = numero.substring(numero.length - 8, numero.length - 5);
                var millones = numero.substring(numero.length - 11, numero.length - 8);
                var billones = numero.substring(0, numero.length - 11);
                salida = aux + billones + "." + millones + "." + miles + "." + cientos + "," + decimal;
                break;
            }
            case numero.length > 8: {
                var decimalMillon = numero.substring(numero.length - 2, numero.length);
                var cientosMillon = numero.substring(numero.length - 5, numero.length - 2);
                var milesMillon = numero.substring(numero.length - 8, numero.length - 5);
                var millonesSolo = numero.substring(0, numero.length - 8);
                salida = aux + millonesSolo + "." + milesMillon + "." + cientosMillon + "," + decimalMillon;
                break;
            }
            case numero.length > 5: {
                var decimalMiles = numero.substring(numero.length - 2, numero.length);
                var cientosMiles = numero.substring(numero.length - 5, numero.length - 2);
                var milesSolo = numero.substring(0, numero.length - 5);
                salida = aux + milesSolo + "." + cientosMiles + "," + decimalMiles;
                break;
            }
            case numero.length > 2: {
                var decimalCorto = numero.substring(numero.length - 2, numero.length);
                var enteros = numero.substring(0, numero.length - 2);
                salida = aux + enteros + "," + decimalCorto;
                break;
            }
            default:
                if (numero.length === 1) {
                    salida = aux + "0,0" + numero;
                } else if (numero.length === 2) {
                    salida = aux + "0," + numero;
                } else {
                    salida = aux + numero;
                }
                break;
        }

        return salida;
    },

    unmascaraMoneda: function unmascaraMoneda(entrada) {
        var valorEntrada = entrada === null || entrada === undefined ? "" : String(entrada);
        return valorEntrada.replace(/\./g, "").replace(/,/g, ".").replace(/\$/g, "").trim();
    },

    validarNumeroInput: function validarNumeroInput(selector) {
        $(document).on("input", selector, function () {
            var inputValue = $(this).val();

            if (!/^\d*$/.test(inputValue)) {
                $(this).val(function (index, value) {
                    return value.replace(/\D/g, "");
                });
            }
        });
    },

    aplicarMascaraMonedaInput: function aplicarMascaraMonedaInput(selector, onChange) {
        $(document).off("input.formatosMoneda", selector).on("input.formatosMoneda", selector, function () {
            var $input = $(this);
            var valorLimpio = String($input.val()).replace(/[^0-9-]/g, "");

            if (!valorLimpio.trim()) {
                $input.val("");
                if (typeof onChange === "function") {
                    onChange.call(this, 0);
                }
                return;
            }

            $input.val(Formatos.mascaraMoneda(valorLimpio));

            if (typeof onChange === "function") {
                onChange.call(this, Formatos.parseNumero($input.val()));
            }
        });

        $(document).off("blur.formatosMoneda", selector).on("blur.formatosMoneda", selector, function () {
            var $input = $(this);

            if (!String($input.val()).trim()) {
                $input.val("");
                return;
            }

            $input.val(Formatos.mascaraMoneda(String($input.val()).replace(/[^0-9-]/g, "")));
        });
    },

    mascaraPorcentaje: function mascaraPorcentaje(entrada, decimales) {
        var valorEntrada = entrada === null || entrada === undefined ? "" : String(entrada);
        var cantidadDecimales = typeof decimales === "number" ? decimales : 2;
        var numero = valorEntrada.replace(/[^\d]/g, "");
        var divisor = Math.pow(10, cantidadDecimales);

        if (!numero.length) {
            return "";
        }

        var valorNumerico = parseInt(numero, 10) / divisor;
        if (!Number.isFinite(valorNumerico)) {
            return "";
        }

        return Math.min(valorNumerico, 100).toLocaleString("es-AR", {
            minimumFractionDigits: cantidadDecimales,
            maximumFractionDigits: cantidadDecimales,
        });
    },

    aplicarMascaraPorcentajeInput: function aplicarMascaraPorcentajeInput(selector, onChange, decimales) {
        var cantidadDecimales = typeof decimales === "number" ? decimales : 2;

        $(document).off("input.formatosPorcentaje", selector).on("input.formatosPorcentaje", selector, function () {
            var $input = $(this);
            var valorLimpio = String($input.val()).replace(/[^0-9-]/g, "");

            if (!valorLimpio.trim()) {
                $input.val("");
                if (typeof onChange === "function") {
                    onChange.call(this, 0);
                }
                return;
            }

            $input.val(Formatos.mascaraPorcentaje(valorLimpio, cantidadDecimales));

            if (typeof onChange === "function") {
                onChange.call(this, Formatos.parseNumero($input.val()));
            }
        });

        $(document).off("blur.formatosPorcentaje", selector).on("blur.formatosPorcentaje", selector, function () {
            var $input = $(this);
            var valorLimpio = String($input.val()).replace(/[^0-9]/g, "");

            if (!valorLimpio.trim()) {
                $input.val("");
                return;
            }

            $input.val(Formatos.mascaraPorcentaje(valorLimpio, cantidadDecimales));
        });
    },

    mascaraPorcentajeDirecto: function mascaraPorcentajeDirecto(entrada) {
        var valorEntrada = entrada === null || entrada === undefined ? "" : String(entrada);
        var numero = valorEntrada.replace(/\D/g, "");
        var salida = "";
        var enteros = "";
        var decimales = "";
        var valorNumerico = 0;

        if (!numero.length) {
            return "";
        }

        if (numero === "100") {
            return "100%";
        }

        if (numero.length <= 2) {
            salida = String(parseInt(numero, 10) || 0);
        } else if (numero.length === 3) {
            enteros = String(parseInt(numero.substring(0, 2), 10) || 0);
            decimales = numero.substring(2, 3);
            salida = enteros + "," + decimales;
        } else {
            enteros = String(parseInt(numero.substring(0, 2), 10) || 0);
            decimales = numero.substring(2, 4);
            salida = enteros + "," + decimales;
        }

        valorNumerico = Formatos.parseNumero(salida);

        if (!Number.isFinite(valorNumerico) || valorNumerico >= 100) {
            return "100%";
        }

        return salida + "%";
    },

    aplicarMascaraPorcentajeDirectoInput: function aplicarMascaraPorcentajeDirectoInput(selector, onChange) {
        $(document).off("input.formatosPorcentajeDirecto", selector).on("input.formatosPorcentajeDirecto", selector, function () {
            var $input = $(this);
            var valorLimpio = String($input.val()).replace(/\D/g, "");

            if (!valorLimpio.trim()) {
                $input.val("");
                if (typeof onChange === "function") {
                    onChange.call(this, 0);
                }
                return;
            }

            $input.val(Formatos.mascaraPorcentajeDirecto(valorLimpio));

            if (typeof onChange === "function") {
                onChange.call(this, Formatos.parseNumero($input.val()));
            }
        });

        $(document).off("blur.formatosPorcentajeDirecto", selector).on("blur.formatosPorcentajeDirecto", selector, function () {
            var $input = $(this);
            var valorLimpio = String($input.val()).replace(/\D/g, "");

            if (!valorLimpio.trim()) {
                $input.val("");
                return;
            }

            $input.val(Formatos.mascaraPorcentajeDirecto(valorLimpio));
        });
    },
};

$.fn.mascara = function () {
    return this.each(function () {
        var $elemento = $(this);
        var entrada = $elemento.is("input") ? $elemento.val() : $elemento.text();
        var salida = Formatos.mascaraMoneda(entrada);

        if ($elemento.is("input")) {
            $elemento.val(salida);
        } else {
            $elemento.text(salida);
        }
    });
};

$.fn.unmasc = function () {
    return this.each(function () {
        var $elemento = $(this);
        var entrada = $elemento.is("input") ? $elemento.val() : $elemento.text();
        var salida = Formatos.unmascaraMoneda(entrada);

        if ($elemento.is("input")) {
            $elemento.val(salida);
        } else {
            $elemento.text(salida);
        }
    });
};

window.Formatos = Formatos;
